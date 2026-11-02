/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          900: '#4A0F19',
          700: '#7A1F2B',
          600: '#8E2632',
          500: '#A3384A'
        },
        gold: {
          500: '#C89B3C',
          300: '#E4C877'
        },
        cream: {
          50: '#FAF6EF',
          100: '#F3ECE0',
          200: '#EAE0CE'
        },
        ink: {
          900: '#241416',
          700: '#3D2A2C',
          500: '#6F5B57',
          300: '#A3928C'
        },
        found: {
          DEFAULT: '#3F6B4E',
          bg: '#E7F0E9'
        },
        lost: {
          DEFAULT: '#AD5A21',
          bg: '#F6E7D8'
        }
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace']
      },
      boxShadow: {
        card: '0 1px 2px rgba(36,20,22,0.06), 0 8px 20px -10px rgba(36,20,22,0.18)'
      }
    }
  },
  plugins: []
}
