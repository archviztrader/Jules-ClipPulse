'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/lib/trpc/client'
import { Video, Upload, Eye, EyeOff, Volume2, VolumeX, Scissors, Play } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface EditorProps {
  video: {
    id: string
    title: string
    videoUrl: string | null
    thumbnailUrl: string | null
    watermarked: boolean
    watermarkRemoved: boolean
    status: string
  }
}

export function Editor({ video }: EditorProps) {
  const { data: session } = useSession()
  const [showAdGate, setShowAdGate] = useState(false)
  const [adCompleted, setAdCompleted] = useState(false)
  const [youtubeForm, setYoutubeForm] = useState({
    title: video.title,
    description: '',
    tags: '',
    privacy: 'public' as 'public' | 'unlisted' | 'private',
  })

  const removeWatermark = api.video.removeWatermark.useMutation()
  const uploadToYoutube = api.video.uploadToYoutube.useMutation()

  const handleRemoveWatermark = async () => {
    if (session?.user?.plan === 'FREE') {
      setShowAdGate(true)
    } else {
      await removeWatermark.mutateAsync({ id: video.id })
    }
  }

  const handleAdComplete = async () => {
    setAdCompleted(true)
    setShowAdGate(false)
    await removeWatermark.mutateAsync({ id: video.id })
  }

  const handleYoutubeUpload = async () => {
    const tags = youtubeForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    
    await uploadToYoutube.mutateAsync({
      id: video.id,
      title: youtubeForm.title,
      description: youtubeForm.description,
      tags,
      privacy: youtubeForm.privacy,
    })
  }

  if (video.status !== 'COMPLETED' || !video.videoUrl) {
    return (
      <div className="text-center py-12">
        <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">Video Not Ready</h2>
        <p className="text-muted-foreground">
          Your video is still processing. Please wait for it to complete.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Video Player */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Video Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              src={video.videoUrl}
              controls
              className="w-full h-full"
              poster={video.thumbnailUrl || undefined}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          
          {video.watermarked && !video.watermarkRemoved && !adCompleted && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium">Watermarked Video</span>
                </div>
                <Button onClick={handleRemoveWatermark} disabled={removeWatermark.isLoading}>
                  {session?.user?.plan === 'FREE' ? 'Watch Ad to Remove' : 'Remove Watermark'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {session?.user?.plan === 'FREE' 
                  ? 'Watch a 15-second ad to remove the watermark from your video.'
                  : 'Remove the watermark to get a clean export.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ad Gate Modal */}
      {showAdGate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Watch Ad to Continue</CardTitle>
              <CardDescription>
                Watch a 15-second ad to remove the watermark from your video.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Ad will play here</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowAdGate(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAdComplete} className="flex-1">
                  Ad Completed
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Editor Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="w-5 h-5" />
              Edit Video
            </CardTitle>
            <CardDescription>
              Trim, adjust audio, and make final edits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input type="number" placeholder="0" min="0" step="0.1" />
              </div>
              <div>
                <Label>End Time</Label>
                <Input type="number" placeholder="5" min="0" step="0.1" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Volume2 className="w-4 h-4 mr-2" />
                Audio On
              </Button>
              <Button variant="outline" size="sm">
                <VolumeX className="w-4 h-4 mr-2" />
                Mute
              </Button>
            </div>

            <Button className="w-full" disabled>
              Apply Changes
            </Button>
            <p className="text-xs text-muted-foreground">
              Advanced editing features coming soon
            </p>
          </CardContent>
        </Card>

        {/* YouTube Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload to YouTube
            </CardTitle>
            <CardDescription>
              Automatically upload your video with SEO optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="youtube-title">Title (max 90 chars)</Label>
              <Input
                id="youtube-title"
                value={youtubeForm.title}
                onChange={(e) => setYoutubeForm(prev => ({ ...prev, title: e.target.value }))}
                maxLength={90}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {youtubeForm.title.length}/90 characters
              </p>
            </div>

            <div>
              <Label htmlFor="youtube-description">Description (max 500 chars)</Label>
              <Textarea
                id="youtube-description"
                value={youtubeForm.description}
                onChange={(e) => setYoutubeForm(prev => ({ ...prev, description: e.target.value }))}
                maxLength={500}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {youtubeForm.description.length}/500 characters
              </p>
            </div>

            <div>
              <Label htmlFor="youtube-tags">Tags (max 15, comma-separated)</Label>
              <Input
                id="youtube-tags"
                value={youtubeForm.tags}
                onChange={(e) => setYoutubeForm(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="viral, shorts, ai, trending"
              />
            </div>

            <div>
              <Label>Privacy</Label>
              <Select
                value={youtubeForm.privacy}
                onValueChange={(value: any) => setYoutubeForm(prev => ({ ...prev, privacy: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="unlisted">Unlisted</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleYoutubeUpload} 
              className="w-full"
              disabled={uploadToYoutube.isLoading}
            >
              {uploadToYoutube.isLoading ? 'Uploading...' : 'Upload to YouTube'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}