/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        arcade: {
          950: '#070a10',
          900: '#0d131f',
          850: '#121929',
          800: '#1a233a',
          750: '#23304e',
          700: '#2e3e65',
          600: '#425585',
          500: '#6479a8',
          400: '#94a3c4',
          300: '#c2cce0',
          100: '#edf2fb',
        },
        lime: {
          accent: '#10f57a',
          glow: '#00ff87',
          dim: '#0a8043',
        },
        hare: {
          DEFAULT: '#f59e0b',
          glow: '#fbbf24',
          dim: '#b45309',
          bg: 'rgba(245, 158, 11, 0.12)',
        },
        tortoise: {
          DEFAULT: '#06b6d4',
          glow: '#38bdf8',
          dim: '#0891b2',
          bg: 'rgba(6, 182, 212, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow-lime': '0 0 20px -3px rgba(16, 245, 122, 0.35)',
        'glow-hare': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glow-tortoise': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
        'glow-collision': '0 0 30px 4px rgba(236, 72, 153, 0.45)',
        'arcade-card': '0 8px 32px -8px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
