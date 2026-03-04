/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#f9d7ac',
          300: '#f4ba77',
          400: '#ee9240',
          500: '#ea751a',
          600: '#db5b10',
          700: '#b54410',
          800: '#903715',
          900: '#742f14',
          950: '#3f1508',
        },
      },
    },
  },
  plugins: [],
}
