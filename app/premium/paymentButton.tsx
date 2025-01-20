"use client"
import { Button } from '@/components/ui/button'
import { loadStripe } from '@stripe/stripe-js'

// Load Stripe using the publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface PaymentButtonProps {
  stripePriceId: string
}

const PaymentButton = ({ stripePriceId }: PaymentButtonProps) => {
  const handlePurchase = async () => {
    try {
      const response = await fetch('/api/createCheckoutSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: stripePriceId }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Error initiating purchase:', error)
    }
  }

  return (
    <Button className="w-full" onClick={handlePurchase}>
      Subscribe
    </Button>
  )
}

export default PaymentButton
