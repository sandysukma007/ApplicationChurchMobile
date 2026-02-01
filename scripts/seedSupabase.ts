import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

async function seed() {
  const { error } = await supabase.from("users").insert([
    { full_name: "Admin User", role: "admin", email: "admin@example.com" },
    { full_name: "Jemaat User", role: "jemaat", email: "jemaat@example.com" },
  ]);

  if (error) console.log("Error:", error.message);
  else console.log("Seed done ✅");
}

seed();
