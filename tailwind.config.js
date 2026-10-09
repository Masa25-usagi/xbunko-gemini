/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        xblue: {
          DEFAULT: '#1d9bf0',
          hover: '#1a8cd8',
        },
        xdark: {
          bg: '#000000',
          surface: '#16181c',
          card: '#16181c',
          border: '#2f3336',
          hover: '#080808',
          textMuted: '#71767b',
        },
      },
    },
  },
  plugins: [],
}
