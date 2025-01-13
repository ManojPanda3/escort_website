import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProfileHeader } from './othersprofile-header'
import { ProfileTabs } from './othersprofile-tabs'
import { cache } from 'react'

// Create cached version of data fetching
const getProfileData = cache(async (supabase: any, id: string) => {
  const [
    { data: profile ,error:profileError},
    { data: pictures ,error:picturesError},
    { data: services ,error:servicesError},
    { data: rates ,error:ratesError},
    { data: testimonials ,error:testimonialsError}
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
  const errors = [profileError,picturesError,servicesError,ratesError,testimonialsError]
  if(errors.some(error => error !== null)){
    const errorMessage = errors.map(error => {
      if(error){
         return error?.message
        }
      }).join(', ');
    throw new Error('Failed to fetch profile data\nerrors are:\t'+errorMessage)
  }

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
  try{  
    const {data:{session}} = await supabase.auth.getSession();
}catch(error:any){
  console.error("Either server error or user does not exist")
  console.error(error.message)
  redirect('/auth/login')
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
        ownerId={session?.user.id.toString() || ''}
      />
    </main>
  )
}
