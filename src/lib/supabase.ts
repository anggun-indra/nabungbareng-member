import { createClient } from "@supabase/supabase-js"
import { auth } from "./firebase"
import type { Database } from "../types/database.types"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing.")
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  accessToken: async () => {
    try {
      if (typeof auth.authStateReady === "function") {
        await auth.authStateReady()
      }
      const user = auth.currentUser
      if (!user) return null
      return (await user.getIdToken(false)) ?? null
    } catch (err) {
      console.warn("Firebase token retrieval error:", err)
      return null
    }
  },
})

/**
 * Helper to get current Supabase User ID (mapped from Firebase UID)
 */
export function getCurrentUserId(): string | null {
  return auth.currentUser?.uid || null
}
