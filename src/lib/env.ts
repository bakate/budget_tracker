import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["production", "development", "test"] as const),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
  DATABASE_URL: z.string(),
  NEXT_PUBLIC_APP_URL: z.string(),
});

const validEnv = schema.safeParse(process.env);

if (!validEnv.success) {
  console.log(process.env);

  throw new Error(validEnv.error.message);
}

export const ENV = validEnv.data;
