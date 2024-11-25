/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,css,tsx}",
    "./*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'Helvetica': ['Helvetica', 'ui-sans-serif']
      },
      colors: {
        'my-blue': '#06c3ff',
      },
      backgroundImage: {
        'black-grid': "url('/assets/blackGrid.png')",
      }
    },
  },
  plugins: [],
}

