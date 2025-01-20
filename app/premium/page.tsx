import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import PaymentButton from './paymentButton'

interface Offer {
  id: string
  type: string
  price: number
  billing_cycle: string
  features: string[]
  stripe_price_id: string
}

export default async function PremiumPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch offers with caching
  const { data: offers, error } = await supabase
    .from('offers')
    .select('*')
    .order('price', { ascending: true }, { head: true, cache: 'force-cache' })

  if (error) {
    console.error('Error fetching offers:', error)
    return <div>Error loading premium plans. Please try again later.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Premium Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offers.map((offer: Offer) => (
          <Card key={offer.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{offer.type}</CardTitle>
              <CardDescription>${offer.price}/{offer.billing_cycle}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="list-disc list-inside mb-4">
                {offer.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </CardContent>
            <CardContent>
              {/* Payment Button for each offer */}
              <PaymentButton stripePriceId={offer.stripe_price_id} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
