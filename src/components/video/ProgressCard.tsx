'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { pusherClient } from '@/lib/pusher'
import { useSession } from 'next-auth/react'
import { Video, Clock, Zap } from 'lucide-react'

interface ProgressCardProps {
  videoId: string
  initialProgress?: number
  initialStatus?: string
}

export function ProgressCard({ videoId, initialProgress = 0, initialStatus = 'PENDING' }: ProgressCardProps) {
  const { data: session } = useSession()
  const [progress, setProgress] = useState(initialProgress)
  const [status, setStatus] = useState(initialStatus)
  const [message, setMessage] = useState('Initializing...')

  useEffect(() => {
    if (!session?.user?.id) return

    const channel = pusherClient.subscribe(`user-${session.user.id}`)

    channel.bind('video-progress', (data: { videoId: string; progress: number; message?: string }) => {
      if (data.videoId === videoId) {
        setProgress(data.progress)
        if (data.message) setMessage(data.message)
      }
    })

    channel.bind('video-complete', (data: { videoId: string }) => {
      if (data.videoId === videoId) {
        setProgress(100)
        setStatus('COMPLETED')
        setMessage('Video completed successfully!')
      }
    })

    channel.bind('video-error', (data: { videoId: string; error: string }) => {
      if (data.videoId === videoId) {
        setStatus('FAILED')
        setMessage(`Error: ${data.error}`)
      }
    })

    return () => {
      pusherClient.unsubscribe(`user-${session.user.id}`)
    }
  }, [session?.user?.id, videoId])

  const getStatusIcon = () => {
    switch (status) {
      case 'COMPLETED':
        return <Video className="w-5 h-5 text-green-500" />
      case 'FAILED':
        return <Zap className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-blue-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600'
      case 'FAILED':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Video Generation
        </CardTitle>
        <CardDescription>
          <span className={getStatusColor()}>
            {status === 'COMPLETED' ? 'Completed' : 
             status === 'FAILED' ? 'Failed' : 
             'Processing'}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{message}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
        
        {status === 'PROCESSING' && (
          <div className="text-sm text-muted-foreground">
            This usually takes 2-5 minutes depending on the engine selected.
          </div>
        )}
      </CardContent>
    </Card>
  )
}