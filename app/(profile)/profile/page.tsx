import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'

// Components
import { ProfileHeader } from './profile-header'
import { ProfileTabs } from './profile-tabs'
import { StoryUploadButton } from './story-upload-button'

// Fetch profile data from Supabase
const getProfileData = async (supabase: any, id: string) => {
  const [
    { data: profile, error: profileError },
    { data: pictures, error: picturesError },
    { data: services, error: servicesError },
    { data: rates, error: ratesError },
    { data: testimonials, error: testimonialsError },
    { data: stories, error: storyError }
  ] = await Promise.all([
    supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single(),
    supabase
      .from('pictures')
      .select('*')
      .eq('owner', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('services')
      .select('*')
      .eq('owner', id),
    supabase
      .from('rates')
      .select('*')
      .eq('owner', id),
    supabase
      .from('testimonials')
      .select('*, users!testimonials_owner_fkey(*)')
      .eq('to', id),
    supabase
      .from('story')
      .select('*')
      .eq('owner', id)
  ])

  // Handle errors
  const errors = [profileError, picturesError, servicesError, ratesError, testimonialsError,storyError]
  if (errors.some(error => error !== null)) {
    const errorMessage = errors
      .map(error => error?.message)
      .filter(Boolean)
      .join(', ')
    console.error('Failed to fetch profile data\nerrors are:\t' + errorMessage)
  }

  return {
    profile,
    pictures: pictures || [],
    services: services || [],
    rates: rates || [],
    testimonials: testimonials || [],
    stories
  }
}

export default async function ProfilePage() {
  // Get authenticated user
  const supabase = createServerComponentClient({ cookies })
  const { data: { user: authUserData }, error } = await supabase.auth.getUser()
  if (!authUserData) {
    notFound()
    return;
  }
  const { id: userId } = authUserData;

  if (!userId || error) {
    redirect('/auth/login')
  }

  // Fetch user data
  const userData = await getProfileData(supabaseAdmin, userId)

  if (userData == null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-center">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-white">
            Some Errors Occured while fetching your profile data
          </h1>
        </div>
      </div>
    )
  }

  const { profile, pictures, services, rates, testimonials,stories} = userData

  return (
    <main className="container mx-auto px-4 py-8">
      <ProfileHeader profile={profile} />
      <div className="mb-6">
        <StoryUploadButton userId={userId} 
        stories={stories}
        />
      </div>
      <ProfileTabs
        pictures={pictures}
        services={services}
        rates={rates}
        testimonials={testimonials}
        userId={userId}
      />
    </main>
  )
}
