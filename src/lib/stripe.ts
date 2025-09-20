import Stripe from 'stripe'
import { env } from '@/lib/env'

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    credits: 3,
    watermark: true,
    adGate: true,
  },
  CREATOR: {
    name: 'Creator',
    price: 19,
    credits: 15,
    watermark: false,
    adGate: false,
  },
  PRO: {
    name: 'Pro',
    price: 49,
    credits: 60,
    watermark: false,
    adGate: false,
  },
  AGENCY: {
    name: 'Agency',
    price: 199,
    credits: 250,
    watermark: false,
    adGate: false,
  },
} as const

export type PlanType = keyof typeof PLANS