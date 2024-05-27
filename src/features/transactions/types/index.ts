import { insertTransactionSchema } from "@/db/schema";
import { client } from "@/lib/hono";
import { InferResponseType } from "hono";
import { z } from "zod";

// we only want to return the data and not the whole response
export type TransactionsResponsetype = InferResponseType<
  typeof client.api.transactions.$get,
  200
>["data"][0];

export const transactionFormSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  amount: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  notes: z.string().nullable().optional(),
});

export const transactionApiSchema = insertTransactionSchema.omit({
  id: true,
});

export type TransactionFormValues = z.input<typeof transactionFormSchema>;
export type TransactionApiValues = z.input<typeof transactionApiSchema>;
