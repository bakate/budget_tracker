import { insertAccountSchema } from "@/db/schema";
import { client } from "@/lib/hono";
import { InferResponseType } from "hono";
import { z } from "zod";

// we only want to return the data and not the whole response
export type AccountsResponsetype = InferResponseType<
  typeof client.api.accounts.$get,
  200
>["data"][0];

export const accountFormSchema = insertAccountSchema.pick({
  name: true,
});

export type AccountFormValues = z.input<typeof accountFormSchema>;
