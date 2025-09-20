'use client'

import { useParams } from 'next/navigation'
import { api } from '@/lib/trpc/client'
import { Editor } from '@/components/video/Editor'
import { ProgressCard } from '@/components/video/ProgressCard'
import { Card, CardContent } from '@/components/ui/card'
import { Video, AlertCircle } from 'lucide-react'

export default function EditorPage() {
  const params = useParams()
  const videoId = params.id as string
  
  const { data: video, isLoading, error } = api.video.getById.useQuery(
    { id: videoId },
    { enabled: !!videoId }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Video Not Found</h2>
          <p className="text-muted-foreground text-center">
            The video you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (video.status === 'PROCESSING' || video.status === 'PENDING') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
          <p className="text-muted-foreground">Your video is being processed</p>
        </div>
        
        <ProgressCard
          videoId={video.id}
          initialProgress={video.progress}
          initialStatus={video.status}
        />
      </div>
    )
  }

  if (video.status === 'FAILED') {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Generation Failed</h2>
          <p className="text-muted-foreground text-center mb-4">
            There was an error generating your video. Please try creating a new one.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
        <p className="text-muted-foreground">Edit and publish your video</p>
      </div>
      
      <Editor video={video} />
    </div>
  )
}