'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Copy, 
  Share2,
  Trophy,
  Gift
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

// Mock data - replace with actual API calls
const mockStats = {
  totalReferrals: 12,
  totalEarnings: 240,
  thisMonthReferrals: 3,
  thisMonthEarnings: 60,
  referralCode: 'CREATOR2024',
  conversionRate: 25,
}

const mockLeaderboard = [
  { rank: 1, name: 'Sarah Chen', referrals: 45, earnings: 900 },
  { rank: 2, name: 'Mike Rodriguez', referrals: 38, earnings: 760 },
  { rank: 3, name: 'Emma Thompson', referrals: 32, earnings: 640 },
  { rank: 4, name: 'You', referrals: 12, earnings: 240 },
  { rank: 5, name: 'Alex Johnson', referrals: 8, earnings: 160 },
]

const mockRecentReferrals = [
  { name: 'John Doe', plan: 'Creator', earnings: 20, date: '2024-01-15' },
  { name: 'Jane Smith', plan: 'Pro', earnings: 40, date: '2024-01-12' },
  { name: 'Bob Wilson', plan: 'Creator', earnings: 20, date: '2024-01-08' },
]

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const referralUrl = `https://clippulse.com/signup?ref=${mockStats.referralCode}`

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: 'Copied!',
        description: 'Referral link copied to clipboard',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      })
    }
  }

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join ClipPulse',
          text: 'Create viral videos with AI! Use my referral link to get started.',
          url: referralUrl,
        })
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      copyToClipboard(referralUrl)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Referral Program</h1>
        <p className="text-muted-foreground">
          Earn $20 for every friend who upgrades to a paid plan
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              +{mockStats.thisMonthReferrals} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockStats.totalEarnings}</div>
            <p className="text-xs text-muted-foreground">
              +${mockStats.thisMonthEarnings} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Above average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leaderboard Rank</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#4</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share this link with friends to earn $20 for each paid signup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={referralUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              onClick={() => copyToClipboard(referralUrl)}
              variant="outline"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button onClick={shareReferral}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Your referral code:</p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {mockStats.referralCode}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Leaderboard
            </CardTitle>
            <CardDescription>Top referrers this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLeaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    user.name === 'You' ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      user.rank === 1 ? 'bg-yellow-500 text-white' :
                      user.rank === 2 ? 'bg-gray-400 text-white' :
                      user.rank === 3 ? 'bg-amber-600 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.referrals} referrals
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${user.earnings}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Referrals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Recent Referrals
            </CardTitle>
            <CardDescription>Your latest successful referrals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentReferrals.map((referral, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{referral.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Upgraded to {referral.plan} • {referral.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+${referral.earnings}</p>
                  </div>
                </div>
              ))}
              
              {mockRecentReferrals.length === 0 && (
                <div className="text-center py-8">
                  <Gift className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No referrals yet</p>
                  <p className="text-sm text-muted-foreground">
                    Share your link to start earning!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Earn money by referring friends to ClipPulse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">1. Share Your Link</h3>
              <p className="text-sm text-muted-foreground">
                Share your unique referral link with friends and followers
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">2. Friends Sign Up</h3>
              <p className="text-sm text-muted-foreground">
                Your friends create an account and upgrade to a paid plan
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">3. Earn Money</h3>
              <p className="text-sm text-muted-foreground">
                Receive $20 for each successful referral to your account
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}