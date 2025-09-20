'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { api } from '@/lib/trpc/client'
import { useSession } from 'next-auth/react'
import { formatCredits, formatDuration, getEngineDisplayName } from '@/lib/utils'
import { 
  Video, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  TrendingUp,
  Calendar,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { ProgressCard } from '@/components/video/ProgressCard'

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data: videos, isLoading: videosLoading } = api.video.getAll.useQuery()
  const { data: usage, isLoading: usageLoading } = api.billing.getUsage.useQuery()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'PROCESSING':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (videosLoading || usageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const processingVideos = videos?.filter(v => v.status === 'PROCESSING') || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || 'Creator'}!
          </p>
        </div>
        <Link href="/create">
          <Button size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create Video
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCredits(usage?.credits || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {usage?.usedCredits || 0} used this month
            </p>
            <Progress 
              value={((usage?.usedCredits || 0) / (usage?.planCredits || 1)) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos Created</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage?.videosCreated || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage?.plan || 'FREE'}</div>
            <p className="text-xs text-muted-foreground">
              {usage?.planCredits || 0} credits/month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingVideos.length}</div>
            <p className="text-xs text-muted-foreground">Videos in queue</p>
          </CardContent>
        </Card>
      </div>

      {/* Processing Videos */}
      {processingVideos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Currently Processing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {processingVideos.map((video) => (
              <ProgressCard
                key={video.id}
                videoId={video.id}
                initialProgress={video.progress}
                initialStatus={video.status}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Videos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recent Videos</h2>
          {videos && videos.length > 5 && (
            <Button variant="outline" size="sm">
              View All
            </Button>
          )}
        </div>

        {!videos || videos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Video className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first AI-generated video to get started
              </p>
              <Link href="/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Video
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 6).map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusColor(video.status)}>
                      {getStatusIcon(video.status)}
                      <span className="ml-1 capitalize">{video.status.toLowerCase()}</span>
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="line-clamp-1">{video.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {video.prompt}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{getEngineDisplayName(video.engine)}</span>
                    {video.duration && (
                      <span>{formatDuration(video.duration)}</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {video.status === 'COMPLETED' && (
                      <Link href={`/editor/${video.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    )}
                    {video.status === 'PROCESSING' && (
                      <Button variant="outline" size="sm" className="flex-1" disabled>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Processing
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}