import { createClient } from '@supabase/supabase-js'

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Auth configuration
export const authConfig = {
  providers: {
    email: {
      enabled: true,
      requireEmailConfirmation: true,
    },
    google: {
      enabled: true,
    },
    github: {
      enabled: true,
    },
    linkedin: {
      enabled: true,
    },
  },
  magicLink: {
    enabled: true,
  },
}

export { supabase }
