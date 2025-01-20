import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProfileHeader } from './othersprofile-header'
import { ProfileTabs } from './othersprofile-tabs'

// Create cached version of data fetching
const getProfileData = (async (supabase: any, id: string) => {
  const [
    { data: profile, error: profileError },
    { data: pictures, error: picturesError },
    { data: services, error: servicesError },
    { data: rates, error: ratesError },
    { data: testimonials, error: testimonialsError }
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
      .select('*, users')
      .eq('to', id)
  ])
  const errors = [profileError, picturesError, servicesError, ratesError, testimonialsError]
  if (errors.some(error => error !== null)) {
    const errorMessage = errors.map(error => {
      if (error) {
        return error?.message
      }
    }).join(', ');
    console.error('Failed to fetch profile data\nerrors are:\t' + errorMessage);
  }
  if (profile == null) return;

  return {
    profile,
    pictures: pictures || [],
    services: services || [],
    rates: rates || [],
    testimonials: testimonials || []
  }
})

export default async function UserProfilePage(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = await props.params;
  const id = params.id
  const supabase = createServerComponentClient({ cookies })
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Either server error or user does not exist")
    console.error(error.message)
  }


  const userData = await getProfileData(supabase, id)
  if (userData == null) {

    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-center">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-white">Search Results for userid "{id}"</h1>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <ProfileHeader profile={userData.profile} />
      <ProfileTabs
        userId={id}
        pictures={userData.pictures}
        services={userData.services}
        rates={userData.rates}
        testimonials={userData.testimonials}
        ownerId={user?.id.toString() || ''}
      />
    </main>
  )
}
