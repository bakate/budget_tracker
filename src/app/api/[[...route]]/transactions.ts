import { Hono } from "hono";

import { db } from "@/db/drizzle";
import {
  accounts,
  categories,
  insertTransactionSchema,
  transactions,
} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { parse, subDays } from "date-fns";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { z } from "zod";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),

    clerkMiddleware(),
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

      const data = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          amount: transactions.amount,
          payee: transactions.payee,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
          category: categories.name,
          categoryId: transactions.categoryId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id)) // accounts is required
        .leftJoin(categories, eq(transactions.categoryId, categories.id)) // categories is optional
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId), // thanks to the inner join, we can filter by the user's accounts
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .orderBy(desc(transactions.date));
      return c.json({ data });
    }
  )
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    clerkMiddleware(),
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

      const { id } = c.req.valid("param");
      if (!id) {
        return c.json(
          {
            message: "Category ID is required.",
          },
          400
        );
      }
      const [data] = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          amount: transactions.amount,
          payee: transactions.payee,
          notes: transactions.notes,
          accountId: transactions.accountId,
          categoryId: transactions.categoryId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(accounts.userId, auth.userId), eq(transactions.id, id)));

      if (!data) {
        return c.json(
          {
            message: "Category not found.",
          },
          404
        );
      }

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertTransactionSchema.omit({
        id: true,
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

      const values = c.req.valid("json");
      const [data] = await db
        .insert(transactions)
        .values({
          ...values,
          id: createId(),
        })
        .returning();
      return c.json({ data }, 201);
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
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

      const { ids } = c.req.valid("json");

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(eq(accounts.userId, auth.userId), inArray(transactions.id, ids))
          )
      );

      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})`
          )
        )

        .returning({
          id: transactions.id,
        });

      return c.json({ data });
    }
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",

      z.array(insertTransactionSchema.omit({ id: true }))
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
      const values = c.req.valid("json");
      const data = await db
        .insert(transactions)
        .values(
          values.map((value) => ({
            ...value,
            id: createId(),
          }))
        )
        .returning();
      return c.json({ data }, 201);
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "json",
      insertTransactionSchema.omit({
        id: true,
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

      const { id } = c.req.valid("param");
      if (!id) {
        return c.json(
          {
            message: "Transaction ID is required.",
          },
          400
        );
      }
      const values = c.req.valid("json");
      const transactionsToUpdate = db.$with("transactions_to_update").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(accounts.userId, auth.userId), eq(transactions.id, id)))
      );

      const [data] = await db
        .with(transactionsToUpdate)
        .update(transactions)
        .set(values)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToUpdate})`
          )
        )
        .returning();

      if (!data) {
        return c.json(
          {
            message: "Transaction not found.",
          },
          404
        );
      }

      return c.json({ data });
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
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

      const { id } = c.req.valid("param");
      if (!id) {
        return c.json(
          {
            message: "Category ID is required.",
          },
          400
        );
      }

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(accounts.userId, auth.userId), eq(transactions.id, id)))
      );

      const [data] = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})`
          )
        )
        .returning({
          id: transactions.id,
        });

      if (!data) {
        return c.json(
          {
            message: "Transaction not found.",
          },
          404
        );
      }

      return c.json({ data });
    }
  );

export default app;
