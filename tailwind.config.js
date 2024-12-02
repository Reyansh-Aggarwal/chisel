/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/*.{html,ts}",
    "./*.html"
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

      },
      animation: {
        gradient: 'gradient 3s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
      letterSpacing: {
        tightest: '-0.75em'
      }

    },
  },
  plugins: [],
}

