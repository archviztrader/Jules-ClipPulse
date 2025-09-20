import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PricingSlider } from '@/components/billing/PricingSlider'
import { SocialLinks } from '@/components/footer/SocialLinks'
import { 
  Video, 
  Zap, 
  Upload, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Shield,
  ArrowRight,
  Play,
  Star
} from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Video,
    title: 'AI Video Generation',
    description: 'Transform text prompts into stunning videos using cutting-edge AI engines like StepFun, Pika, and Qwen.',
  },
  {
    icon: Upload,
    title: 'YouTube Integration',
    description: 'Automatically upload your videos to YouTube with SEO-optimized titles, descriptions, and thumbnails.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate professional videos in minutes, not hours. Real-time progress tracking keeps you informed.',
  },
  {
    icon: Sparkles,
    title: 'Multiple Engines',
    description: 'Choose from 6 different AI engines, each optimized for different video styles and lengths.',
  },
  {
    icon: TrendingUp,
    title: 'Viral Optimization',
    description: 'Built-in features to maximize engagement and virality across all social media platforms.',
  },
  {
    icon: Shield,
    title: 'Enterprise Ready',
    description: 'White-label options, API access, and team management for agencies and businesses.',
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Content Creator',
    content: 'ClipPulse transformed my content creation workflow. I can now produce viral videos 10x faster!',
    rating: 5,
  },
  {
    name: 'Mike Rodriguez',
    role: 'Marketing Agency Owner',
    content: 'The white-label features are incredible. Our clients love the professional results.',
    rating: 5,
  },
  {
    name: 'Emma Thompson',
    role: 'YouTuber',
    content: 'The YouTube integration saves me hours every week. My channel growth has been amazing.',
    rating: 5,
  },
]

const faqs = [
  {
    question: 'How does the AI video generation work?',
    answer: 'Our AI engines analyze your text prompt and generate high-quality videos using advanced machine learning models. You can choose from different engines optimized for various styles and lengths.',
  },
  {
    question: 'Can I remove watermarks on the free plan?',
    answer: 'Yes! Free users can remove watermarks by watching a 15-second ad. Paid plans get watermark-free videos automatically.',
  },
  {
    question: 'What video formats and resolutions are supported?',
    answer: 'We support MP4 format with resolutions up to 4K (depending on your plan). All videos are optimized for social media platforms.',
  },
  {
    question: 'How does the YouTube integration work?',
    answer: 'Connect your YouTube account and we\'ll automatically upload your videos with SEO-optimized titles, descriptions, tags, and thumbnails.',
  },
  {
    question: 'Is there an API available?',
    answer: 'Yes! Agency plan subscribers get access to our REST API for custom integrations and white-label solutions.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">ClipPulse</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground">
              FAQ
            </Link>
            <Link href="/signup">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Create Viral Videos with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your ideas into engaging short videos for TikTok, YouTube Shorts, and Instagram Reels. 
            No editing skills required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Creating Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          
          {/* Hero Video/Image */}
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Video className="w-16 h-16 mx-auto mb-4 text-primary" />
                <p className="text-lg font-medium">Demo Video Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, edit, and distribute viral content at scale
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Creators</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of content creators who trust ClipPulse
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your content creation needs
            </p>
          </div>
          
          <PricingSlider />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about ClipPulse
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-left">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Go Viral?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators making viral content with AI
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Creating Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">ClipPulse</span>
              </div>
              <p className="text-muted-foreground mb-4">
                AI-powered viral video creation for the modern creator.
              </p>
              <SocialLinks />
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
                <li><Link href="/api-keys">API</Link></li>
                <li><Link href="/referrals">Referrals</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/security">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 ClipPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}