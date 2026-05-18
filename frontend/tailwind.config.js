/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
        display: ['"Sora"', '"Manrope"', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#12111a',
          700: '#2b2833',
          500: '#4d4758',
        },
        mist: {
          50: '#f6f4f0',
          100: '#ece7de',
          200: '#d6cfc6',
        },
        tide: {
          50: '#eef5f3',
          100: '#d9ebe7',
          200: '#b7d6cf',
        },
        ember: {
          500: '#ff7a59',
          600: '#f45f38',
        },
      },
      boxShadow: {
        glow: '0 24px 60px -28px rgba(18, 17, 26, 0.45)',
      },
    },
  },
  plugins: [],
}

