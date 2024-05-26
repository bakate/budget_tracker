import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

import { createInsertSchema } from "drizzle-zod";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  plaidId: text("plaid_id"),
  userId: text("user_id").notNull(),
});

export const insertAccountSchema = createInsertSchema(accounts);
