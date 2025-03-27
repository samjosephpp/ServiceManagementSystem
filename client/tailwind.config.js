/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('daisyui'),
      daisyui
    ],
  }