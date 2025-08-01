/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      letterSpacing: {
        'extra-wide': '0.3em',
        'super-wide': '0.25em',
      },
      fontSize: { '2xs': '0.625rem' },
      maxHeight: { 800: '800px' },
      backgroundImage: {
        'gradient-black': 'linear-gradient(135deg, #000 0%, #333 100%)',
      },
    },
  },
  plugins: [],
};
