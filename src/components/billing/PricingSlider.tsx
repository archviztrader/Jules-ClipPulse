'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Crown, Building } from 'lucide-react'
import { PLANS } from '@/lib/stripe'
import { api } from '@/lib/trpc/client'
import { useSession } from 'next-auth/react'

const planFeatures = {
  FREE: [
    '3 videos per day',
    'Watermarked exports',
    'Watch ads to remove watermark',
    'Basic AI engines',
    'Community support',
  ],
  CREATOR: [
    '15 videos per month',
    'No watermarks',
    'Priority processing',
    'All AI engines',
    'Email support',
    'HD exports',
  ],
  PRO: [
    '60 videos per month',
    'No watermarks',
    'Fastest processing',
    'All AI engines',
    'Priority support',
    '4K exports',
    'Custom branding',
  ],
  AGENCY: [
    '250 videos per month',
    'No watermarks',
    'Dedicated processing',
    'All AI engines',
    'White-label access',
    '4K exports',
    'Custom branding',
    'API access',
    'Team management',
  ],
}

const planIcons = {
  FREE: Zap,
  CREATOR: Check,
  PRO: Crown,
  AGENCY: Building,
}

export function PricingSlider() {
  const { data: session } = useSession()
  const [isAnnual, setIsAnnual] = useState(false)
  
  const createCheckoutSession = api.billing.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url
      }
    },
  })

  const handleUpgrade = async (plan: 'CREATOR' | 'PRO' | 'AGENCY') => {
    if (!session) {
      // Redirect to sign in
      window.location.href = '/signup'
      return
    }

    await createCheckoutSession.mutateAsync({ plan })
  }

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={!isAnnual ? 'font-medium' : 'text-muted-foreground'}>Monthly</span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isAnnual ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isAnnual ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={isAnnual ? 'font-medium' : 'text-muted-foreground'}>
          Annual
          <Badge variant="secondary" className="ml-2">Save 20%</Badge>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(PLANS).map(([key, plan]) => {
          const Icon = planIcons[key as keyof typeof planIcons]
          const features = planFeatures[key as keyof typeof planFeatures]
          const price = isAnnual ? Math.round(plan.price * 0.8) : plan.price
          const isCurrentPlan = session?.user?.plan === key
          const isFreePlan = key === 'FREE'
          
          return (
            <Card 
              key={key} 
              className={`relative ${key === 'PRO' ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {key === 'PRO' && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <div className="text-3xl font-bold">
                    ${price}
                    {!isFreePlan && <span className="text-lg font-normal">/mo</span>}
                  </div>
                  {isAnnual && !isFreePlan && (
                    <div className="text-sm text-muted-foreground line-through">
                      ${plan.price}/mo
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button
                  className="w-full"
                  variant={key === 'PRO' ? 'default' : 'outline'}
                  onClick={() => !isFreePlan && handleUpgrade(key as any)}
                  disabled={isCurrentPlan || createCheckoutSession.isLoading || isFreePlan}
                >
                  {isCurrentPlan ? 'Current Plan' : 
                   isFreePlan ? 'Get Started' : 
                   'Upgrade'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}