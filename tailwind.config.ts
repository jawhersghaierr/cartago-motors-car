import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf9ed',
          100: '#f8efc4',
          200: '#f2db85',
          300: '#ecc44b',
          400: '#e5ac28',
          500: '#d4921a',
          600: '#b97015',
          700: '#8f5014',
          800: '#773f17',
          900: '#663418',
          950: '#3a1a09',
        },
        carbon: {
          50:  '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#111111',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gold-shimmer': 'linear-gradient(135deg, #d4921a 0%, #ecc44b 40%, #f2db85 60%, #d4921a 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'gold': '0 0 30px rgba(212, 146, 26, 0.3)',
        'gold-lg': '0 0 60px rgba(212, 146, 26, 0.4)',
        'premium': '0 25px 50px rgba(0,0,0,0.5)',
        'card': '0 4px 20px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-sky-400', 'border-sky-500',
    'bg-emerald-500', 'border-emerald-600',
    'bg-red-500', 'border-red-600',
    'bg-amber-500', 'border-amber-600',
    'bg-blue-500', 'border-blue-600',
    'bg-purple-500', 'border-purple-600',
    'bg-gray-500', 'border-gray-600',
  ],
}
export default config
