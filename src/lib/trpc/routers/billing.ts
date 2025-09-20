import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../server'
import { stripe, PLANS } from '@/lib/stripe'
import { TRPCError } from '@trpc/server'

export const billingRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure
    .input(z.object({
      plan: z.enum(['CREATOR', 'PRO', 'AGENCY']),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const plan = PLANS[input.plan]
      
      const session = await stripe.checkout.sessions.create({
        customer_email: user.email,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `ClipPulse ${plan.name}`,
                description: `${plan.credits} credits per month`,
              },
              unit_amount: plan.price * 100,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
        metadata: {
          userId: user.id,
          plan: input.plan,
        },
      })

      return { url: session.url }
    }),

  getUsage: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { credits: true, plan: true }
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const currentMonth = new Date()
      currentMonth.setDate(1)
      currentMonth.setHours(0, 0, 0, 0)

      const usage = await ctx.prisma.video.aggregate({
        where: {
          userId: ctx.session.user.id,
          createdAt: { gte: currentMonth },
        },
        _sum: { creditsUsed: true },
        _count: true,
      })

      return {
        credits: user.credits,
        plan: user.plan,
        usedCredits: usage._sum.creditsUsed || 0,
        videosCreated: usage._count,
        planCredits: PLANS[user.plan as keyof typeof PLANS].credits,
      }
    }),
})