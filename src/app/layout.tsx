import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { api } from '@/lib/trpc/client'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClipPulse - AI-Powered Viral Video Creation',
  description: 'Transform your ideas into viral short videos with AI. Create engaging content for TikTok, YouTube Shorts, and Instagram Reels.',
  keywords: ['AI video', 'short videos', 'viral content', 'TikTok', 'YouTube Shorts', 'Instagram Reels'],
  authors: [{ name: 'ClipPulse Team' }],
  openGraph: {
    title: 'ClipPulse - AI-Powered Viral Video Creation',
    description: 'Transform your ideas into viral short videos with AI',
    url: 'https://clippulse.com',
    siteName: 'ClipPulse',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ClipPulse - AI Video Creation',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClipPulse - AI-Powered Viral Video Creation',
    description: 'Transform your ideas into viral short videos with AI',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default api.withTRPC(RootLayout)