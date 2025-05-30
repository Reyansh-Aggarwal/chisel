const { transform } = require('typescript');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./pages/*.html",
    "./social-media/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'helvetica-light': ['helvetica-light', 'sans-serif'],
        'helvetica-roman': ['helvetica-roman', 'sans-serif'],
        'helvetica-bold': ['helvetica-bold', 'sans-serif'],
      },
      colors: {
        'my-blue': '#06c3ff',
        'my-gray': '#292929'
      },
      backgroundImage: {
        'black-grid': "url('https://reyansh-aggarwal.github.io/chisel/assets/blackGrid.png')",
        "start-now": "url('https://reyansh-aggarwal.github.io/chisel/assets/startNow2.png')",

      },
      animation: {
        gradient: 'gradient 3s ease infinite',
        marquee: 'marquee 10s linear infinite',
        'swipe-right': 'swipe-right 0.5s ease-in-out forwards',
        //'swipe-left': 'swipe-left 0.5s ease-in-out forwards',
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        marquee: {
          '0%': { transform: 'translateX(2%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'swipe-right': {
          '0%': {transform: 'translateX(0)'},
          '100%': {transform: 'translateX(100%)'}
        },
        /*'swipe-left': {
          '0%': {transform: 'translateY(0)'},
          '100%': {transform: 'translateY(100%)'}
        }*/
      },
      letterSpacing: {
        tightest: '-0.75em'
      }

    },
  },
  plugins: [],
}

