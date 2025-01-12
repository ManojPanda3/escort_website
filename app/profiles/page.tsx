import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProfileHeader } from './profile-header'
import { ProfileTabs } from './profile-tabs'
import { StoryUploadButton } from './story-upload-button'

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
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
    .from('stories')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="container mx-auto px-4 py-8">
      <ProfileHeader profile={profile} isOwnProfile={true} />
      <div className="mb-6">
        <StoryUploadButton userId={session.user.id} />
      </div>
      <ProfileTabs 
        pictures={pictures || []}
        services={services || []}
        rates={rates || []}
        testimonials={testimonials || []}
        stories={stories || []}
        isOwnProfile={true}
      />
    </main>
  )
}

