import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

import { supabase } from './supabaseClient';

export const createUserTablesIfNotExist = async () => {
  const query = `
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user'
  ) THEN
    CREATE TABLE public.user (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      name TEXT,
      isVip BOOLEAN DEFAULT FALSE,
      stories UUID[], 
      price TEXT, 
      available BOOLEAN, 
      location TEXT,
      age INTEGER CHECK (age >= 18 AND age <= 100),
      profile_picture TEXT 
      purches UUID[]
    );
  END IF;
END $$;
  `;
  const { error } = await supabase.rpc('pg_execute', { query });

  if (error) {
    console.error('Error creating table:', error.message);
  }
}

export const createStoryTablesIfNotExist = async () => {
  const query = `
  DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'story'
      ) THEN
        CREATE TABLE public.story (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          video TEXT NOT NULL,
          title TEXT NOT NULL,
          likes INTEGER
        );
      END IF;
    END $$;
`;
  const { error } = await supabase.rpc('pg_execute', { query });

  if (error) {
    console.error('Error creating table:', error.message);
  }
}

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

