import { createClient } from "@supabase/supabase-js";

// Attempt to get credentials from Vite's env variables.
// Cast `import.meta` to `any` to bypass TypeScript errors in environments without Vite types.
// The runtime environment may not be Vite, in which case `import.meta.env` will be undefined.
const viteEnv = (import.meta as any).env;

// Use Vite env vars if available, otherwise fall back to provided default credentials.
// FIX: Use optional chaining (?.) to safely access properties on viteEnv, which might be undefined.
// This prevents the "Cannot read properties of undefined" error.
const supabaseUrl = viteEnv?.VITE_SUPABASE_URL || "https://nnwybypiohalwlfgxyyb.supabase.co";
const supabaseKey = viteEnv?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ud3lieXBpb2hhbHdsZmd4eXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MjUwMDgsImV4cCI6MjA3OTQwMTAwOH0.NBtVo-nXWmjnZtkHnECIWgWWt3Bst7nbfjIDq_BPyzg";

// If we are falling back to the default credentials, log a warning.
// This check is also made safe with optional chaining.
if (!viteEnv?.VITE_SUPABASE_URL || !viteEnv?.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    "Variabel environment Supabase (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) tidak diatur.",
    "Menggunakan kredensial default. Aplikasi mungkin berjalan dalam mode offline/demo jika kredensial ini tidak valid atau proyek tidak aktif."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);