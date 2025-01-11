import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProfileHeader } from '../profile-header'
import { ProfileTabs } from '../profile-tabs'

export default async function UserProfilePage({
  params
}: {
  params: { id: string }
}) {
  const id = params.id
  const supabase = createServerComponentClient({ cookies })

  if (!id) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  const { data: pictures } = await supabase
    .from('pictures')
    .select('*')
    .eq('owner', id)
    .order('created_at', { ascending: false })

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('owner', id)

  const { data: rates } = await supabase
    .from('rates')
    .select('*')
    .eq('owner', id)

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*, users!testimonials_owner_fkey(*)')
    .eq('to', id)

  return (
    <main className="container mx-auto px-4 py-8">
      <ProfileHeader profile={profile} isOwnProfile={false} />
      <ProfileTabs
        pictures={pictures || []}
        services={services || []}
        rates={rates || []}
        testimonials={testimonials || []}
      />
    </main>
  )
}
