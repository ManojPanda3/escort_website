import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProfileHeader } from './othersprofile-header'
import { ProfileTabs } from './othersprofile-tabs'
import { cache } from 'react'

// Create cached version of data fetching
const getProfileData = cache(async (supabase: any, id: string) => {
  const [
    { data: profile },
    { data: pictures },
    { data: services },
    { data: rates },
    { data: testimonials }
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
      .eq('to', id)
  ])

  return {
    profile,
    pictures: pictures || [],
    services: services || [],
    rates: rates || [],
    testimonials: testimonials || []
  }
})

export default async function UserProfilePage({
  params
}: {
  params: { id: string }
}) {
  const id = params.id
  const supabase = createServerComponentClient({ cookies })
  const {data:{session},error} = await supabase.auth.getSession();
  if(error){
    console.error(error.message)
  }
  if(session?.user.id === id){
    redirect('/profile')
  }

  if (!id) {
    redirect('/auth/login')
  }

  const userData = await getProfileData(supabase, id)

  return (
    <main className="container mx-auto px-4 py-8">
      <ProfileHeader profile={userData.profile} />
      <ProfileTabs
        userId={id}
        pictures={userData.pictures}
        services={userData.services}
        rates={userData.rates}
        testimonials={userData.testimonials}
        ownerId={session?.user.id}
      />
    </main>
  )
}
