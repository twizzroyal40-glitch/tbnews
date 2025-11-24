import { createClient } from "@supabase/supabase-js";

// Menggunakan nilai hardcoded karena di environment ini tidak bisa membaca .env secara langsung dengan mudah
// Dalam produksi, sebaiknya tetap gunakan process.env
const supabaseUrl = "https://nnwybypiohalwlfgxyyb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ud3lieXBpb2hhbHdsZmd4eXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MjUwMDgsImV4cCI6MjA3OTQwMTAwOH0.NBtVo-nXWmjnZtkHnECIWgWWt3Bst7nbfjIDq_BPyzg";

export const supabase = createClient(supabaseUrl, supabaseKey);