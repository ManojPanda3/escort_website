import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { EditProfileForm } from './edit-profile-form'
import { SubscriptionPlans } from './subscription-plans'
import { Success } from '@/components/ui/success'

export default async function EditProfilePage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
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

