import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://isogrkikdwmiagdbwctx.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlzb2dya2lrZHdtaWFnZGJ3Y3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjcyMDksImV4cCI6MjA1MjAwMzIwOX0.hsaqUbyus2e-Zxnq0qgoF8EJDUlmrGl11bkdBSHqqvc"

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

