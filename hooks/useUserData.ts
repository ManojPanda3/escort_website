import { User } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const CACHE_KEY = 'userData'

interface CachedData {
  user: User
  profile: any
  pictures: any[]
  services: any[]
  rates: any[]
  testimonials: any[]
  stories: any[]
  expiresAt: number
}

export async function updateCache() {
  const supabase = createClientComponentClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return [false, { 
        user: null,
        profile: null,
        pictures: [],
        services: [],
        rates: [],
        testimonials: [],
        stories: []
      }]
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error("Error While getting session\nError:", sessionError)
      return [false, null]
    }

    const expiresAt = session?.expires_at ? session.expires_at * 1000 : Date.now()

    if (user && session) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      const { data: pictures } = await supabase
        .from('pictures')
        .select('*')
        .eq('owner', session.user.id)
        .order('created_at', { ascending: false })

      const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('owner', session.user.id)

      const { data: rates } = await supabase
        .from('rates')
        .select('*')
        .eq('owner', session.user.id)

      const { data: testimonials } = await supabase
        .from('testimonials')
        .select('*, users!testimonials_owner_fkey(*)')
        .eq('to', session.user.id)

      const { data: stories } = await supabase
        .from('story')
        .select('*')
        .eq('owner', session.user.id)
        .order('created_at', { ascending: false })

      const userData = {
        user,
        profile,
        pictures: pictures || [],
        services: services || [],
        rates: rates || [],
        testimonials: testimonials || [],
        stories: stories || []
      }

      // Cache the data
      const cacheData: CachedData = {
        ...userData,
        expiresAt
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))

      return [true, userData]
    }
  } catch (error) {
    console.error("Error updating cache:", error)
    return [false, null]
  }
}

export function getCachedData() {
  const cacheString = localStorage.getItem(CACHE_KEY);

  if (!cacheString) {
    return { 
      user: null, 
      profile: null,
      pictures: [],
      services: [],
      rates: [],
      testimonials: [],
      stories: []
    };
  }

  try {
    const cacheData: CachedData = JSON.parse(cacheString);

    // Check if the cache is expired
    if (cacheData.expiresAt < Date.now()) {
      localStorage.removeItem(CACHE_KEY); // Clear expired cache
      return { 
        user: null, 
        profile: null,
        pictures: [],
        services: [],
        rates: [],
        testimonials: [],
        stories: []
      };
    }

    return {
      user: cacheData.user,
      profile: cacheData.profile,
      pictures: cacheData.pictures,
      services: cacheData.services,
      rates: cacheData.rates,
      testimonials: cacheData.testimonials,
      stories: cacheData.stories
    };
  } catch (error) {
    console.error("Error parsing cached data:", error);
    return { 
      user: null, 
      profile: null,
      pictures: [],
      services: [],
      rates: [],
      testimonials: [],
      stories: []
    };
  }
}
