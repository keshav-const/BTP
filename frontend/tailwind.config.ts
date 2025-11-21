import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary accent: Deep emerald green (sophisticated, premium)
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857', // Primary accent
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Zinc palette for backgrounds and text
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-1': ['64px', { lineHeight: '72px', fontWeight: '700' }],
        'display-2': ['48px', { lineHeight: '56px', fontWeight: '700' }],
        'display-3': ['36px', { lineHeight: '44px', fontWeight: '600' }],
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'premium-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'premium': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'premium-md': '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        'premium-lg': '0 20px 25px -5px rgb(0 0 0 / 0.07), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
        'premium-xl': '0 25px 50px -12px rgb(0 0 0 / 0.15)',
        'premium-emerald': '0 10px 30px -5px rgba(4, 120, 87, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer-gold': 'shimmerGold 3s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'slide-in-scale': 'slideInScale 0.6s ease-out',
        'rotate-in': 'rotateIn 0.5s ease-out',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmerGold: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(4, 120, 87, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(4, 120, 87, 0.6)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-30px) translateX(20px)' },
          '66%': { transform: 'translateY(-15px) translateX(-20px)' },
        },
        slideInScale: {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        rotateIn: {
          '0%': { opacity: '0', transform: 'rotate(-10deg) scale(0.9)' },
          '100%': { opacity: '1', transform: 'rotate(0deg) scale(1)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(to bottom right, #18181b, #09090b)',
        'gradient-emerald-subtle': 'linear-gradient(135deg, rgba(4, 120, 87, 0.1) 0%, rgba(4, 120, 87, 0.05) 100%)',
        'gradient-mesh-emerald': `radial-gradient(at 0% 0%, rgba(4, 120, 87, 0.15) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(5, 150, 105, 0.1) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(4, 120, 87, 0.15) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(5, 150, 105, 0.1) 0px, transparent 50%)`,
        'gradient-animated-emerald': 'linear-gradient(-45deg, rgba(4, 120, 87, 0.1), rgba(5, 150, 105, 0.15), rgba(16, 185, 129, 0.1), rgba(4, 120, 87, 0.15))',
      },
      backgroundSize: {
        'gradient-animated': '400% 400%',
      },
      backdropBlur: {
        'glass': '12px',
        'glass-heavy': '24px',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
