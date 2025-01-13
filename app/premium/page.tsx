import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const plans = [
  {
    name: 'Basic',
    price: '$9.99/month',
    features: [
      'Profile customization',
      'Up to 5 photos',
      'Basic search visibility',
    ],
  },
  {
    name: 'Pro',
    price: '$19.99/month',
    features: [
      'All Basic features',
      'Up to 15 photos',
      'Enhanced search visibility',
      'Featured listing',
    ],
  },
  {
    name: 'VIP',
    price: '$39.99/month',
    features: [
      'All Pro features',
      'Unlimited photos',
      'Top search visibility',
      'Verified badge',
      '24/7 support',
    ],
  },
]

export default async function PremiumPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Premium Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside mb-4">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Button className="w-full">Subscribe</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

