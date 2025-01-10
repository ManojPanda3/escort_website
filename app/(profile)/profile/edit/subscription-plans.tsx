'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Check, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PLANS = {
  basic: {
    name: 'Basic',
    price: {
      monthly: 3.5,
      yearly: 37.8, // 10% discount
    },
    features: ['1 City Promotion', 'Basic Profile Features', 'Standard Support'],
  },
  premium: {
    name: 'Premium',
    price: {
      monthly: 4.5,
      yearly: 48.6, // 10% discount
    },
    features: ['5 City Promotion', 'Advanced Profile Features', 'Priority Support'],
  },
  pro: {
    name: 'Pro',
    price: {
      monthly: 7,
      yearly: 75.6, // 10% discount
    },
    features: ['Nationwide Promotion', 'Premium Profile Features', '24/7 Support'],
  },
}

interface SubscriptionPlansProps {
  currentPlan?: string
}

export function SubscriptionPlans({ currentPlan }: SubscriptionPlansProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const handleSubscribe = async (plan: string) => {
    setLoading(true)
    setError('')

    // Here you would typically integrate with a payment provider
    // For now, we'll just update the user's plan in Supabase
    const { error: updateError } = await supabase
      .from('users')
      .update({
        subscription_plan: plan,
        subscription_cycle: billingCycle,
      })
      .eq('id', (await supabase.auth.getUser()).data.user?.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plans</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <Select
            value={billingCycle}
            onValueChange={(value: 'monthly' | 'yearly') => setBillingCycle(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select billing cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly Billing</SelectItem>
              <SelectItem value="yearly">Yearly Billing (10% off)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {Object.entries(PLANS).map(([key, plan]) => (
            <Card key={key} className="relative">
              {currentPlan === key && (
                <Badge className="absolute top-4 right-4">Current Plan</Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">
                    ${plan.price[billingCycle].toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">
                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-4"
                  variant={currentPlan === key ? 'outline' : 'default'}
                  disabled={loading || currentPlan === key}
                  onClick={() => handleSubscribe(key)}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {currentPlan === key ? 'Current Plan' : 'Subscribe'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

