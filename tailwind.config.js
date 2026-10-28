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
        /* テーマ連動デザイントークン (src/index.css の CSS 変数を参照) */
        xb: {
          bg: 'rgb(var(--xb-bg) / <alpha-value>)',
          surface: 'rgb(var(--xb-surface) / <alpha-value>)',
          elevated: 'rgb(var(--xb-elevated) / <alpha-value>)',
          hover: 'rgb(var(--xb-hover) / <alpha-value>)',
          hoverstrong: 'rgb(var(--xb-hover-strong) / <alpha-value>)',
          border: 'rgb(var(--xb-border) / <alpha-value>)',
          text: 'rgb(var(--xb-text) / <alpha-value>)',
          strong: 'rgb(var(--xb-text-strong) / <alpha-value>)',
          muted: 'rgb(var(--xb-muted) / <alpha-value>)',
          accent: 'rgb(var(--xb-accent) / <alpha-value>)',
          accenthover: 'rgb(var(--xb-accent-hover) / <alpha-value>)',
          contrast: 'rgb(var(--xb-contrast) / <alpha-value>)',
          contrasttext: 'rgb(var(--xb-contrast-text) / <alpha-value>)',
          overlay: 'rgb(var(--xb-overlay) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
}
