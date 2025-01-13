import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProfileHeader } from './profile-header'
import { ProfileTabs } from './profile-tabs'
import { StoryUploadButton } from './story-upload-button'
import { Success } from '@/components/ui/success'

export const getProfileData = async (supabase: any, id: string) => {
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
}
export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/auth/login')
  }
  const {profile, pictures, services, rates, testimonials} = await getProfileData(supabase, session?.user.id)

  return (
    <main className="container mx-auto px-4 py-8">
      <ProfileHeader profile={profile}/>
      <div className="mb-6">
        <StoryUploadButton userId={session.user.id} />
      </div>
      <ProfileTabs
        pictures={pictures || []}
        services={services || []}
        rates={rates || []}
        testimonials={testimonials || []}
      />
    </main>
  )
}

