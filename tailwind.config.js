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
        gb: {
          forest: '#183C32',
          olive: '#386641',
          leaf: '#6A994E',
          pale: '#A7C957',
          cream: '#F2E8CF',
          surface: '#FAF7EE',
          ink: '#0D1F18',
          border: '#183C32',
        },
        hare: {
          DEFAULT: '#E76F51',
          light: '#F4A261',
          dark: '#B04228',
          bg: 'rgba(231, 111, 81, 0.15)',
        },
        tortoise: {
          DEFAULT: '#2A9D8F',
          light: '#48CAE4',
          dark: '#264653',
          bg: 'rgba(42, 157, 143, 0.15)',
        },
        retro: {
          success: '#38B000',
          warning: '#E9C46A',
          error: '#E63946',
          purple: '#7209B7',
        },
        dmg: {
          darkest: '#0f380f',
          dark: '#306230',
          light: '#8bac0f',
          lightest: '#9bbc0f',
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        vt323: ['"VT323"', 'monospace'],
        mono: ['"VT323"', '"JetBrains Mono"', 'monospace'],
        sans: ['"VT323"', 'sans-serif'],
      },
      boxShadow: {
        'pixel-sm': '2px 2px 0px 0px #0D1F18',
        'pixel': '4px 4px 0px 0px #0D1F18',
        'pixel-lg': '6px 6px 0px 0px #0D1F18',
        'pixel-inset': 'inset 2px 2px 0px 0px rgba(0,0,0,0.2)',
        'pixel-btn': '3px 3px 0px 0px #183C32',
        'pixel-btn-pressed': '1px 1px 0px 0px #183C32',
      },
      animation: {
        'bounce-pixel': 'bouncePixel 0.8s infinite steps(2)',
        'blink': 'blink 0.7s infinite steps(1)',
      },
      keyframes: {
        bouncePixel: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
