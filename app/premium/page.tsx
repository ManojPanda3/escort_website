import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'

const plans = [
  {
    name: "Basic",
    price: "$29.99",
    description: "Perfect for getting started",
    features: [
      "Basic profile customization",
      "Up to 5 photos",
      "Standard support",
      "Basic search visibility",
      "Contact up to 10 users/month"
    ]
  },
  {
    name: "Professional",
    price: "$49.99",
    description: "Most popular choice",
    features: [
      "Advanced profile customization",
      "Up to 15 photos",
      "Priority support",
      "Enhanced search visibility",
      "Contact up to 30 users/month",
      "Featured listing in search",
      "Custom profile URL"
    ]
  },
  {
    name: "VIP",
    price: "$99.99",
    description: "For serious professionals",
    features: [
      "Full profile customization",
      "Unlimited photos",
      "24/7 premium support",
      "Top search visibility",
      "Unlimited contacts",
      "Featured listing everywhere",
      "Custom profile URL",
      "Verified badge",
      "Access to VIP events",
      "Profile analytics"
    ]
  }
]

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
            Premium Plans
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className="relative overflow-hidden">
              {plan.name === "Professional" && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-amber-600 text-black px-4 py-1 rounded-bl-lg text-sm font-medium">
                  Popular
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full mt-6"
                  variant={plan.name === "Professional" ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

