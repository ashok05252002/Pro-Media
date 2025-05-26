/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#112A46',
          light: '#FFFFFF',
          dark: '#081021',
        },
        secondary: {
          DEFAULT: '#64748B',
        },
        accent: {
          DEFAULT: '#FFB31F',
          pink: '#FFC9CA',
        },
        theme: {
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          accent: 'var(--color-accent)',
          success: 'var(--color-success)',
          danger: 'var(--color-danger)',
          info: 'var(--color-info)',
          warning: 'var(--color-warning)',
          'light-accent': 'var(--color-light-accent)',
          'dark-accent': 'var(--color-dark-accent)',
        }
      },
    },
  },
  plugins: [],
}
