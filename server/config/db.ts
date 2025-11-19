import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE;

console.log("Supabase URL:", supabaseUrl);

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL and service key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
