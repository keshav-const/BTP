import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

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
        'glass-sm': '0 2px 8px 0 rgba(4, 120, 87, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'glass': '0 8px 32px 0 rgba(4, 120, 87, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'glass-lg': '0 16px 48px 0 rgba(4, 120, 87, 0.1), inset 0 2px 0 0 rgba(255, 255, 255, 0.2)',
        'glow-emerald': '0 0 30px rgba(4, 120, 87, 0.3), 0 0 60px rgba(4, 120, 87, 0.15)',
        'glow-emerald-lg': '0 0 40px rgba(4, 120, 87, 0.4), 0 0 80px rgba(4, 120, 87, 0.2)',
        'inner-glow': 'inset 0 0 20px rgba(4, 120, 87, 0.1)',
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
        'parallax-drift': 'parallaxDrift 20s ease-in-out infinite',
        'float-orbit': 'floatOrbit 12s ease-in-out infinite',
        'shimmer-sweep': 'shimmerSweep 3s ease-in-out infinite',
        'magnetic-pulse': 'magneticPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
        parallaxDrift: {
          '0%, 100%': { 
            transform: 'translate3d(0, 0, 0) rotate(0deg)',
          },
          '25%': { 
            transform: 'translate3d(10px, -20px, 0) rotate(1deg)',
          },
          '50%': { 
            transform: 'translate3d(-5px, -35px, 0) rotate(-0.5deg)',
          },
          '75%': { 
            transform: 'translate3d(-15px, -15px, 0) rotate(0.5deg)',
          },
        },
        floatOrbit: {
          '0%, 100%': { 
            transform: 'translate3d(0, 0, 0) scale(1)',
          },
          '33%': { 
            transform: 'translate3d(30px, -30px, 0) scale(1.05)',
          },
          '66%': { 
            transform: 'translate3d(-30px, -20px, 0) scale(0.95)',
          },
        },
        shimmerSweep: {
          '0%': { 
            backgroundPosition: '-200% center',
            opacity: '0.5',
          },
          '50%': {
            opacity: '1',
          },
          '100%': { 
            backgroundPosition: '200% center',
            opacity: '0.5',
          },
        },
        magneticPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(4, 120, 87, 0.2)',
            transform: 'scale(1)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(4, 120, 87, 0.4)',
            transform: 'scale(1.02)',
          },
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
        'gradient-emerald-spotlight': 'radial-gradient(circle at 50% 0%, rgba(4, 120, 87, 0.15), transparent 70%)',
        'gradient-zinc-dusk': 'linear-gradient(135deg, rgba(244, 244, 245, 0.95), rgba(228, 228, 231, 0.98))',
        'gradient-emerald-zinc-mesh': `radial-gradient(at 0% 0%, rgba(4, 120, 87, 0.1) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(5, 150, 105, 0.08) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(244, 244, 245, 0.9) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(4, 120, 87, 0.12) 0px, transparent 50%)`,
        'shimmer-sweep': 'linear-gradient(90deg, transparent 0%, rgba(4, 120, 87, 0.1) 50%, transparent 100%)',
      },
      backgroundSize: {
        'gradient-animated': '400% 400%',
        'shimmer-sweep': '200% 100%',
      },
      backdropBlur: {
        'glass': '12px',
        'glass-heavy': '24px',
        'glass-sm': '8px',
        'glass-md': '16px',
        'glass-xl': '32px',
      },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'magnetic': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'premium': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      scale: {
        '102': '1.02',
        '98': '0.98',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
