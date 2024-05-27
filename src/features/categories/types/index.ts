import { insertCategorySchema } from "@/db/schema";
import { client } from "@/lib/hono";
import { InferResponseType } from "hono";
import { z } from "zod";

// we only want to return the data and not the whole response
export type CategoriesResponsetype = InferResponseType<
  typeof client.api.categories.$get,
  200
>["data"][0];

export const categoryFormSchema = insertCategorySchema.pick({
  name: true,
});

export type CategoryFormValues = z.input<typeof categoryFormSchema>;
