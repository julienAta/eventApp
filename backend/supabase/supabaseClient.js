import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qzinopakcibzfrasjyxz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6aW5vcGFrY2liemZyYXNqeXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgyNzU0NDUsImV4cCI6MjAzMzg1MTQ0NX0.ByFiiih9Xo5v6Mt99hlwPrnKafH5GVW2PBPtnrBx6io";

export const supabase = createClient(supabaseUrl, supabaseKey);
