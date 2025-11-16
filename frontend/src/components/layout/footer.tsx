import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-24 bg-gradient-luxury text-cream-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial-gold opacity-40" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-bronze-400/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* About */}
          <div className="space-y-4">
            <Link href="/" className="text-3xl font-serif font-bold bg-gradient-to-r from-gold-200 to-gold-400 bg-clip-text text-transparent">
              E-Store
            </Link>
            <p className="text-cream-200 text-sm leading-relaxed">
              Curated premium goods crafted for discerning tastes. Experience a new era of elevated shopping.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-white mb-4">Discover</h4>
            <ul className="space-y-3 text-sm text-cream-200">
              <li>
                <Link href="/products" className="hover:text-gold-200 transition-colors">Shop</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-200 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-200 transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold-200 transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-cream-200">
              <li>
                <Link href="/shipping" className="hover:text-gold-200 transition-colors">Shipping Info</Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-gold-200 transition-colors">Returns</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gold-200 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold-200 transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-4 text-sm text-cream-200">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-200" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-200" />
                <a href="mailto:support@estore.com" className="hover:text-gold-200 transition-colors">
                  support@estore.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gold-200" />
                <span>123 Maison Ave, Luxe City, LA 90210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-cream-200">
            &copy; {new Date().getFullYear()} E-Store. Crafted with care for elevated living.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
