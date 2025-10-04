// Lightweight wrapper for Supabase client inside client/src
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mqbyqcvhbjyzsrdwzjeu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xYnlxY3ZoYmp5enNyZHd6amV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjM2ODAsImV4cCI6MjA3NTEzOTY4MH0.Jkk9yCA-wPvs-urDp7A2L9AYDbFROIE0bBhDaFr4VIs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
