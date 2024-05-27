import { Hono } from "hono";

import { db } from "@/db/drizzle";
import { categories, insertCategorySchema } from "@/db/schema";
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
          message: "Hello, unauthenticated user!",
        },
        401
      );
    }

    const data = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(eq(categories.userId, auth.userId));

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
            message: "Category ID is required.",
          },
          400
        );
      }
      const [data] = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)));

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
      insertCategorySchema.pick({
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
        .insert(categories)
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
        .delete(categories)
        .where(
          and(eq(categories.userId, auth.userId), inArray(categories.id, ids))
        )
        .returning({
          id: categories.id,
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
      insertCategorySchema.pick({
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
            message: "Category ID is required.",
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
        .update(categories)
        .set({
          name,
        })
        .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
        .returning();

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

      const [data] = await db
        .delete(categories)
        .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
        .returning();

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
  );

export default app;
