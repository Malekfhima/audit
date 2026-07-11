/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Brand ink/navy — replaces the default indigo scale everywhere
        // it's referenced in the codebase (bg-indigo-*, text-indigo-*, ring-indigo-*...)
        indigo: {
          50: '#F2F4F8',
          100: '#E4E8F0',
          200: '#C7CFDE',
          300: '#9CA8C2',
          400: '#6C7899',
          500: '#47526B',
          600: '#242E45',
          700: '#182238',
          800: '#111A2C',
          900: '#0B1220',
          950: '#070B14',
        },
        // Brand brass/gold — replaces purple, used as the secondary accent
        // (gradients, highlights, hover states) throughout the app
        purple: {
          50: '#FBF6EC',
          100: '#F5E9CE',
          200: '#E9D19E',
          300: '#DCB86E',
          400: '#CC9F49',
          500: '#B8873D',
          600: '#A67730',
          700: '#8A6326',
          800: '#6E4F1F',
          900: '#523B17',
          950: '#3A2A10',
        },
      },
    },
  },
  plugins: [],
}
