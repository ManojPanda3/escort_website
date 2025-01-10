import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { EditProfileForm } from './edit-profile-form'
import { SubscriptionPlans } from './subscription-plans'

export default async function EditProfilePage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  console.log(session.user.id)
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()
  if (profile == null) redirect("/auth/login")

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <EditProfileForm profile={profile} />
        <SubscriptionPlans currentPlan={profile?.subscription_plan} />
      </div>
    </main>
  )
}

