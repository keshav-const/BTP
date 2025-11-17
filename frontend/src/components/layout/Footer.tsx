'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export function Footer() {
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
    {
      title: 'Follow',
      links: [
        { label: 'Facebook', href: 'https://facebook.com' },
        { label: 'Twitter', href: 'https://twitter.com' },
        { label: 'Instagram', href: 'https://instagram.com' },
        { label: 'LinkedIn', href: 'https://linkedin.com' },
      ],
    },
  ]

  return (
    <footer className="bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-2xl font-bold gradient-text mb-4">
              Premium
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              Curating exceptional products for elevated living. Handcrafted experiences, premium quality.
            </p>
            <div className="flex gap-4 mt-6">
              <Link
                href="https://facebook.com"
                className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} className="text-zinc-600 dark:text-zinc-400" />
              </Link>
              <Link
                href="https://twitter.com"
                className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={20} className="text-zinc-600 dark:text-zinc-400" />
              </Link>
              <Link
                href="https://instagram.com"
                className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} className="text-zinc-600 dark:text-zinc-400" />
              </Link>
              <Link
                href="https://linkedin.com"
                className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} className="text-zinc-600 dark:text-zinc-400" />
              </Link>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-serif font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © {new Date().getFullYear()} Premium. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors duration-200"
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
