import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6aW5vcGFrY2liemZyYXNqeXh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODI3NTQ0NSwiZXhwIjoyMDMzODUxNDQ1fQ.L4tuF9gs4F2i0BX5JtnkJN7CBTaluAWYo3ejy1RC-20";

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
