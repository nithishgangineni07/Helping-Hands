/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Primary green
          600: '#059669', // Darker green
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        charcoal: {
          50: '#f6f7f8',
          100: '#e3e5e8',
          200: '#c7cbd2',
          300: '#a2a9b5',
          400: '#7a8494',
          500: '#5e6878',
          600: '#4a5361',
          700: '#3c434f',
          800: '#2b303a',
          900: '#1d2128',
          950: '#111318',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
        'emerald': '0 10px 25px -5px rgba(16, 185, 129, 0.25)',
      }
    },
  },
  plugins: [],
}
