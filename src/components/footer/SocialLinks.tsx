'use client'

import { Twitter, Instagram, Linkedin, Github } from 'lucide-react'

const socialLinks = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/clippulse',
    icon: Twitter,
  },
  {
    name: 'Instagram', 
    href: 'https://instagram.com/clippulse',
    icon: Instagram,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/clippulse',
    icon: Linkedin,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/clippulse',
    icon: Github,
  },
]

export function SocialLinks() {
  return (
    <div className="flex items-center gap-4">
      {socialLinks.map((link) => {
        const Icon = link.icon
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={link.name}
          >
            <Icon className="w-5 h-5" />
          </a>
        )
      })}
    </div>
  )
}