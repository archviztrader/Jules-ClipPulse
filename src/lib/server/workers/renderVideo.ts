import { Queue, Worker } from 'bullmq'
import { prisma } from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher'
import { env } from '@/lib/env'
import * as engines from '../engines'

// Create queue
export const renderVideoQueue = new Queue('render-video', {
  connection: {
    host: env.REDIS_URL.split('://')[1].split(':')[0],
    port: parseInt(env.REDIS_URL.split(':')[2] || '6379'),
  },
})

// Job data interface
interface RenderVideoJob {
  videoId: string
  userId: string
}

// Create worker
const worker = new Worker('render-video', async (job) => {
  const { videoId, userId } = job.data as RenderVideoJob
  
  try {
    console.log(`Processing video ${videoId} for user ${userId}`)
    
    // Get video details
    const video = await prisma.video.findUnique({
      where: { id: videoId },
    })
    
    if (!video) {
      throw new Error('Video not found')
    }

    // Update status to processing
    await prisma.video.update({
      where: { id: videoId },
      data: { status: 'PROCESSING', progress: 10 },
    })

    // Notify frontend
    await pusherServer.trigger(`user-${userId}`, 'video-progress', {
      videoId,
      progress: 10,
      status: 'PROCESSING',
    })

    // Step 1: Download original (if URL provided)
    if (video.originalUrl) {
      await updateProgress(videoId, userId, 20, 'Downloading original video...')
      // TODO: Implement yt-dlp download
    }

    // Step 2: Transcribe (if needed)
    await updateProgress(videoId, userId, 30, 'Transcribing audio...')
    // TODO: Implement OpenAI Whisper transcription

    // Step 3: Rewrite script
    await updateProgress(videoId, userId, 40, 'Rewriting script...')
    const scriptResult = await engines.chatglm(video.prompt)

    // Step 4: Generate visuals
    await updateProgress(videoId, userId, 60, 'Generating visuals...')
    let videoResult
    
    switch (video.engine) {
      case 'stepfun':
        videoResult = await engines.stepfun(video.prompt)
        break
      case 'qwen':
        videoResult = await engines.qwen(video.prompt)
        break
      case 'pika':
        videoResult = await engines.pika(video.prompt)
        break
      case 'invideo':
        videoResult = await engines.invideo(video.prompt)
        break
      default:
        throw new Error(`Unsupported engine: ${video.engine}`)
    }

    if (!videoResult.success) {
      throw new Error(videoResult.error || 'Video generation failed')
    }

    // Step 5: Generate voice (if specified)
    if (video.voice) {
      await updateProgress(videoId, userId, 80, 'Generating voice-over...')
      // TODO: Implement ElevenLabs voice generation
    }

    // Step 6: Stitch video
    await updateProgress(videoId, userId, 90, 'Stitching final video...')
    // TODO: Implement FFmpeg.wasm stitching

    // Step 7: Upload to Supabase
    await updateProgress(videoId, userId, 95, 'Uploading to storage...')
    // TODO: Upload to Supabase Storage

    // Generate thumbnail
    const thumbnailResult = await engines.vheer(video.prompt)

    // Final update
    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        videoUrl: videoResult.videoUrl,
        thumbnailUrl: thumbnailResult.thumbnailUrl,
        duration: 5, // Mock duration
      },
    })

    // Deduct credits
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: video.creditsUsed,
        },
      },
    })

    // Final notification
    await pusherServer.trigger(`user-${userId}`, 'video-complete', {
      videoId,
      videoUrl: videoResult.videoUrl,
      thumbnailUrl: thumbnailResult.thumbnailUrl,
    })

    console.log(`Video ${videoId} completed successfully`)
    
  } catch (error) {
    console.error(`Error processing video ${videoId}:`, error)
    
    // Update video status to failed
    await prisma.video.update({
      where: { id: videoId },
      data: { status: 'FAILED' },
    })

    // Notify frontend of failure
    await pusherServer.trigger(`user-${userId}`, 'video-error', {
      videoId,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}, {
  connection: {
    host: env.REDIS_URL.split('://')[1].split(':')[0],
    port: parseInt(env.REDIS_URL.split(':')[2] || '6379'),
  },
})

async function updateProgress(videoId: string, userId: string, progress: number, message: string) {
  await prisma.video.update({
    where: { id: videoId },
    data: { progress },
  })

  await pusherServer.trigger(`user-${userId}`, 'video-progress', {
    videoId,
    progress,
    message,
  })
}

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err)
})

console.log('Video render worker started')