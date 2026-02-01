import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

async function ping() {
  const { data, error } = await supabase.from("masses").select("id").limit(1);
  if (error) console.log("Ping error:", error.message);
  else console.log("Pinged Supabase ✅", new Date().toISOString());
}

// Ping setiap 5 menit supaya server tidak tidur
setInterval(ping, 5 * 60 * 1000);

ping(); // ping pertama langsung
