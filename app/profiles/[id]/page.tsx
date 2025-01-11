import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { ProfileHeader } from '../profile-header'
import { ProfileTabs } from '../profile-tabs'

export default async function UserProfilePage({
  params
}: {
  params: { id: string }
}) {
  console.log(params)
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  // Fetch the profile data for the requested user ID
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!profile) {
    notFound()
  }

  // Fetch related data
  const { data: pictures } = await supabase
    .from('pictures')
    .select('*')
    .eq('owner', params.id)
    .order('created_at', { ascending: false })

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('owner', params.id)

  const { data: rates } = await supabase
    .from('rates')
    .select('*')
    .eq('owner', params.id)

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*, users!testimonials_owner_fkey(*)')
    .eq('to', params.id)

  const isOwnProfile = session?.user?.id === params.id

  return (
    <main className="container mx-auto px-4 py-8">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
      <ProfileTabs
        pictures={pictures || []}
        services={services || []}
        rates={rates || []}
        testimonials={testimonials || []}
      />
    </main>
  )
}

