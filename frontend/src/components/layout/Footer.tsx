'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { FloatingElements } from '@/components/ui/FloatingElements'
import { Button } from '@/components/ui/Button'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { cn } from '@/lib/utils'

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const footerSections = [
    {
      title: 'About',
      links: [
        { label: 'Our Story', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Products',
      links: [
        { label: 'Shop All', href: '/products' },
        { label: 'New Arrivals', href: '/products?sort=newest' },
        { label: 'Best Sellers', href: '/products?sort=popular' },
        { label: 'Sale', href: '/products?sale=true' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Shipping', href: '/shipping' },
        { label: 'Returns', href: '/returns' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
  ]

  const socialLinks = [
    { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
    { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  ]

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const event = new CustomEvent('app-toast', {
      detail: {
        title: 'Success!',
        description: 'You have been subscribed to our newsletter.',
        variant: 'success',
      },
    })
    window.dispatchEvent(event)
    
    setEmail('')
    setIsSubmitting(false)
  }

  return (
    <footer className="relative bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <FloatingElements count={4} size="md" speed="slow" blur="xl" opacity={0.2} colorScheme="mixed" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <GlassCard variant="accent" className="p-6 sm:p-8 mb-12 sm:mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold gradient-text mb-2">
                Stay in the Loop
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-xl">
                Subscribe to our newsletter for exclusive deals, new arrivals, and premium content delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:min-w-[400px]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 rounded-lg glass-light border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  aria-label="Email address"
                />
                <Button
                  type="submit"
                  variant="solid"
                  size="md"
                  loading={isSubmitting}
                  rightIcon={<Send size={16} />}
                  magnetic
                  className="sm:w-auto"
                >
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-12">
          <GlassCard variant="default" className="p-6 lg:col-span-2">
            <h3 className="font-serif text-2xl font-bold gradient-text mb-4">
              Premium
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
              Curating exceptional products for elevated living. Handcrafted experiences, premium quality.
            </p>
            
            <div className="relative">
              <div className="absolute inset-0 -z-10" aria-hidden="true">
                <FloatingElements count={2} size="sm" speed="slow" blur="xl" opacity={0.4} />
              </div>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className={cn(
                      "p-2.5 rounded-lg glass-light hover:glass-medium transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-zinc-900",
                      "group"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon 
                      size={20} 
                      className="text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-500 transition-colors duration-200" 
                    />
                  </Link>
                ))}
              </div>
            </div>
          </GlassCard>

          {footerSections.map((section) => (
            <GlassCard key={section.title} variant="default" className="p-6">
              <h4 className="font-serif font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-zinc-900 rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>

        <div className="pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © {new Date().getFullYear()} Premium. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
