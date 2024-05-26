import { Hono } from "hono";

import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json(
        {
          message: "Unauthorized. Please sign in.",
        },
        401
      );
    }

    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    return c.json({ data });
  })
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
            message: "Account ID is required.",
          },
          400
        );
      }
      const [data] = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)));

      if (!data) {
        return c.json(
          {
            message: "Account not found.",
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
      insertAccountSchema.pick({
        name: true,
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

      const { name } = c.req.valid("json");
      const [data] = await db
        .insert(accounts)
        .values({
          name,
          userId: auth.userId,
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
      const data = await db
        .delete(accounts)
        .where(and(eq(accounts.userId, auth.userId), inArray(accounts.id, ids)))
        .returning({
          id: accounts.id,
        });

      return c.json({ data });
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
      insertAccountSchema.pick({
        name: true,
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
            message: "Account ID is required.",
          },
          400
        );
      }
      const { name } = c.req.valid("json");
      if (!name) {
        return c.json(
          {
            message: "Name is required.",
          },
          400
        );
      }

      const [data] = await db
        .update(accounts)
        .set({
          name,
        })
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning();

      if (!data) {
        return c.json(
          {
            message: "Account not found.",
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
            message: "Account ID is required.",
          },
          400
        );
      }

      const [data] = await db
        .delete(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning();

      if (!data) {
        return c.json(
          {
            message: "Account not found.",
          },
          404
        );
      }

      return c.json({ data });
    }
  );

export default app;
