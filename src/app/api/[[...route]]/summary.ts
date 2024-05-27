import { accounts, categories, transactions } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { differenceInDays, parse, subDays } from "date-fns";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/db/drizzle";

import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, desc, eq, gte, lt, lte, sql } from "drizzle-orm";

const app = new Hono().get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json(
        {
          message: "Unauthorized. Please sign in.",
        },
        401
      );
    }

    const { from, to, accountId } = c.req.valid("query");

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from
      ? parse(from, "yyyy-MM-dd", new Date())
      : defaultFrom;
    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    const fetchFinancialData = async (
      userId: string,
      startData: Date,
      endDate: Date
    ) => {
      return db
        .select({
          income:
            sql`SUM(CASE WHEN ${transactions.amount} > 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ),
          expenses:
            sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ),
          remaining: sql`SUM(${transactions.amount})`.mapWith(Number),
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, userId),
            gte(transactions.date, startData),
            lte(transactions.date, endDate)
          )
        );
    };

    const [currentPeriod, lastPeriod] = await Promise.all([
      fetchFinancialData(auth.userId, startDate, endDate),
      fetchFinancialData(auth.userId, lastPeriodStart, lastPeriodEnd),
    ]);
    const incomeChange = calculatePercentageChange(
      currentPeriod[0].income,
      lastPeriod[0].income
    );
    const expensesChange = calculatePercentageChange(
      currentPeriod[0].expenses,
      lastPeriod[0].expenses
    );

    const remainingChange = calculatePercentageChange(
      currentPeriod[0].remaining,
      lastPeriod[0].remaining
    );

    const category = await db
      .select({
        name: categories.name,
        value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(categories.id, transactions.categoryId))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          lt(transactions.amount, 0),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(categories.name)
      .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`));

    const topCategories = category.slice(0, 3);
    const otherCategories = category.slice(3);

    const otherSum = otherCategories.reduce(
      (acc, current) => acc + current.value,
      0
    );
    const finalCategories = topCategories;
    if (otherCategories.length > 0) {
      finalCategories.push({ name: "Other", value: otherSum });
    }

    const activeDays = await db
      .select({
        date: transactions.date,
        income:
          sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
            Number
          ),
        expenses:
          sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(
            Number
          ),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),

          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(transactions.date)
      .orderBy(transactions.date);

    const allDays = fillMissingDays(activeDays, startDate, endDate);
    return c.json({
      data: {
        remainingAmount: currentPeriod[0].remaining,
        incomeAmount: currentPeriod[0].income,
        expensesAmount: currentPeriod[0].expenses,
        incomeChange,
        expensesChange,
        remainingChange,
        categories: finalCategories,
        days: allDays,
      },
    });
  }
);

export default app;
