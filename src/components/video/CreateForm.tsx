'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/trpc/client'
import { useRouter } from 'next/navigation'
import { Upload, Link, Sparkles } from 'lucide-react'

const createVideoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt too long'),
  engine: z.enum(['stepfun', 'qwen', 'pika', 'invideo']),
  voice: z.string().optional(),
  originalUrl: z.string().url().optional().or(z.literal('')),
})

type CreateVideoForm = z.infer<typeof createVideoSchema>

const engines = [
  { value: 'stepfun', label: 'StepFun', description: '5s, 1080p, 2 credits' },
  { value: 'qwen', label: 'Qwen', description: '5s, Free tier, 0 credits' },
  { value: 'pika', label: 'Pika', description: '3s, Cinematic, 3 credits' },
  { value: 'invideo', label: 'InVideo', description: '60s, Long-form, 1 credit' },
]

const voices = [
  { value: 'alloy', label: 'Alloy' },
  { value: 'echo', label: 'Echo' },
  { value: 'fable', label: 'Fable' },
  { value: 'onyx', label: 'Onyx' },
  { value: 'nova', label: 'Nova' },
  { value: 'shimmer', label: 'Shimmer' },
]

export function CreateForm() {
  const [inputType, setInputType] = useState<'url' | 'file'>('url')
  const router = useRouter()
  
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<CreateVideoForm>({
    resolver: zodResolver(createVideoSchema),
    defaultValues: {
      engine: 'stepfun',
    },
  })

  const createVideo = api.video.create.useMutation({
    onSuccess: (video) => {
      router.push(`/editor/${video.id}`)
    },
  })

  const onSubmit = async (data: CreateVideoForm) => {
    try {
      await createVideo.mutateAsync(data)
    } catch (error) {
      console.error('Failed to create video:', error)
    }
  }

  const selectedEngine = watch('engine')

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Create Your Video</h1>
        <p className="text-muted-foreground">
          Transform your ideas into viral short videos with AI
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Input Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Source Material
            </CardTitle>
            <CardDescription>
              Start with a YouTube URL or upload your own file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={inputType === 'url' ? 'default' : 'outline'}
                onClick={() => setInputType('url')}
                className="flex-1"
              >
                <Link className="w-4 h-4 mr-2" />
                YouTube URL
              </Button>
              <Button
                type="button"
                variant={inputType === 'file' ? 'default' : 'outline'}
                onClick={() => setInputType('file')}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>

            {inputType === 'url' ? (
              <div>
                <Label htmlFor="originalUrl">YouTube URL</Label>
                <Input
                  id="originalUrl"
                  placeholder="https://youtube.com/watch?v=..."
                  {...register('originalUrl')}
                />
                {errors.originalUrl && (
                  <p className="text-sm text-destructive mt-1">{errors.originalUrl.message}</p>
                )}
              </div>
            ) : (
              <div>
                <Label htmlFor="file">Upload Video File</Label>
                <Input
                  id="file"
                  type="file"
                  accept="video/*"
                  className="cursor-pointer"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Video Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="My Awesome Video"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Make it cyberpunk, 16:9, energetic with neon colors and futuristic elements..."
                className="min-h-[100px]"
                {...register('prompt')}
              />
              {errors.prompt && (
                <p className="text-sm text-destructive mt-1">{errors.prompt.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Engine Selection */}
        <Card>
          <CardHeader>
            <CardTitle>AI Engine</CardTitle>
            <CardDescription>
              Choose the AI engine that best fits your needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedEngine}
              onValueChange={(value) => setValue('engine', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {engines.map((engine) => (
                  <SelectItem key={engine.value} value={engine.value}>
                    <div>
                      <div className="font-medium">{engine.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {engine.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Voice Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Voice (Optional)</CardTitle>
            <CardDescription>
              Add AI-generated voice-over to your video
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setValue('voice', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.value} value={voice.value}>
                    {voice.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting || createVideo.isLoading}
        >
          {isSubmitting || createVideo.isLoading ? 'Creating...' : 'Generate Video'}
        </Button>
      </form>
    </div>
  )
}