import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase instance with anonymous key
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin Supabase instance only for server-side
const isServer = typeof window === 'undefined'
export const supabaseAdmin = isServer ? createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
) : null