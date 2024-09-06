import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key in environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Expose the raw connection for Drizzle
const connectionString = `${supabaseUrl}?apikey=${supabaseKey}`;
export const queryClient = postgres(connectionString);
export const db: PostgresJsDatabase = drizzle(queryClient);
