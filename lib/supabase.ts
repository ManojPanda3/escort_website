import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: any) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) throw error
}

export async function getStories(userId: string) {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data
}

export async function addStory(userId: string, title: string, videoLink: string) {
  const { error } = await supabase
    .from('stories')
    .insert({ user_id: userId, title, video_link: videoLink })

  if (error) throw error
}