import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { ENV } from "@/lib/env";

export const sql = neon(ENV.DATABASE_URL!);
export const db = drizzle(sql);
