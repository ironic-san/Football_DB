/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14231f',
        pitch: '#15803d',
        'pitch-dark': '#0f5c2d',
        cream: '#f7f8f5',
      },
      boxShadow: {
        soft: '0 12px 35px rgba(20, 35, 31, 0.07)',
      },
    },
  },
  plugins: [],
}
