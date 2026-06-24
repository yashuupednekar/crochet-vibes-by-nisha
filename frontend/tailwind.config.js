/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50:  '#fff1f5',
          100: '#ffe4ed',
          200: '#fecdd9',
          300: '#fda4bf',
          400: '#fb7ea8',
          500: '#f43f7a',
          600: '#e11d6a',
          700: '#be1258',
          800: '#9d1350',
          900: '#881347',
        },
        blush: {
          50:  '#fdf6f9',
          100: '#fbeef4',
          200: '#f5d9e8',
          300: '#edb8d3',
          400: '#e090b8',
          500: '#cc6a9a',
          600: '#b54d80',
          700: '#953d68',
          800: '#7c3458',
          900: '#682e4c',
        },
        cream: '#fdf8f0',
        mauve: '#c9a0b4',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}