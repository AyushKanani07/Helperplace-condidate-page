/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}",],
  theme: {
    extend: {},
    screens: {
      'sm': '426px',
      // => @media (min-width: 576px) { ... }

      'md': '900px',
      // => @media (min-width: 960px) { ... }

      'lg': '1025px',
      // => @media (min-width: 1440px) { ... }

      'xl': '1441px',

      '2xl': '2560px',
    },
  },
  plugins: [],
}

