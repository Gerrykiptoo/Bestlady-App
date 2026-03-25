/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f0',
          100: '#fbe9e1',
          200: '#f7d3c3',
          300: '#f3bda5',
          400: '#efa787',
          500: '#8B4513',
          600: '#7a3b10',
          700: '#69320e',
          800: '#58280b',
          900: '#471f09',
        },
      },
    },
  },
  plugins: [],
}
