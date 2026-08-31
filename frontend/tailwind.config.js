/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0e17',
          card: '#111827',
          cardHover: '#1a2234',
          border: '#1f293d',
          input: '#151c2c',
        },
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        cyber: {
          cyan: '#00f0ff',
          gold: '#fbbf24',
          amber: '#f59e0b',
          purple: '#8b5cf6',
          violet: '#a855f7',
          pink: '#ec4899',
          emerald: '#10b981',
          crimson: '#f43f5e',
        },
        mlbb: {
          blue: '#2563eb',
          gold: '#f59e0b',
          purple: '#7c3aed',
          dark: '#0b0f19',
        }
      },
      fontFamily: {
        sans: ['"Kantumruy Pro"', 'Kantumruy', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.25)',
        'glow-gold': '0 0 25px rgba(245, 158, 11, 0.25)',
        'glow-purple': '0 0 25px rgba(139, 92, 246, 0.25)',
        'cyber-card': '0 8px 30px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
