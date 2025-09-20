import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../server'
import { TRPCError } from '@trpc/server'
import { renderVideoQueue } from '@/lib/server/workers/renderVideo'

const createVideoSchema = z.object({
  title: z.string().min(1).max(100),
  prompt: z.string().min(1).max(1000),
  engine: z.enum(['stepfun', 'qwen', 'pika', 'invideo', 'chatglm', 'vheer']),
  voice: z.string().optional(),
  originalUrl: z.string().url().optional(),
})

export const videoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createVideoSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { credits: true, plan: true }
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      // Check if user has enough credits
      const requiredCredits = getEngineCredits(input.engine)
      if (user.credits < requiredCredits) {
        throw new TRPCError({ 
          code: 'BAD_REQUEST', 
          message: 'Insufficient credits' 
        })
      }

      // Create video record
      const video = await ctx.prisma.video.create({
        data: {
          userId: ctx.session.user.id,
          title: input.title,
          prompt: input.prompt,
          engine: input.engine,
          voice: input.voice,
          originalUrl: input.originalUrl,
          status: 'PENDING',
          creditsUsed: requiredCredits,
          watermarked: user.plan === 'FREE',
        },
      })

      // Add to queue
      await renderVideoQueue.add('render-video', {
        videoId: video.id,
        userId: ctx.session.user.id,
      })

      return video
    }),

  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.prisma.video.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { createdAt: 'desc' },
      })
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const video = await ctx.prisma.video.findFirst({
        where: { 
          id: input.id,
          userId: ctx.session.user.id 
        },
      })

      if (!video) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return video
    }),

  removeWatermark: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const video = await ctx.prisma.video.findFirst({
        where: { 
          id: input.id,
          userId: ctx.session.user.id 
        },
      })

      if (!video) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      if (!video.watermarked) {
        throw new TRPCError({ 
          code: 'BAD_REQUEST', 
          message: 'Video is not watermarked' 
        })
      }

      return ctx.prisma.video.update({
        where: { id: input.id },
        data: { watermarkRemoved: true },
      })
    }),

  uploadToYoutube: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().max(90),
      description: z.string().max(500),
      tags: z.array(z.string()).max(15),
      privacy: z.enum(['public', 'unlisted', 'private']),
    }))
    .mutation(async ({ ctx, input }) => {
      const video = await ctx.prisma.video.findFirst({
        where: { 
          id: input.id,
          userId: ctx.session.user.id,
          status: 'COMPLETED'
        },
      })

      if (!video) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      // TODO: Implement YouTube upload logic
      // This would use the YouTube Data API v3

      return ctx.prisma.video.update({
        where: { id: input.id },
        data: {
          youtubeTitle: input.title,
          youtubeDescription: input.description,
          youtubeTags: input.tags,
          youtubePrivacy: input.privacy,
          // youtubeId: uploadedVideoId,
        },
      })
    }),
})

function getEngineCredits(engine: string): number {
  const credits: Record<string, number> = {
    stepfun: 2,
    qwen: 0,
    pika: 3,
    invideo: 1,
    chatglm: 0,
    vheer: 0,
  }
  return credits[engine] || 1
}