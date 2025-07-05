/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#459c98',
          50: '#edf7f7',
          100: '#d1eae9',
          200: '#a3d6d3',
          300: '#75c1bd',
          400: '#53aea8',
          500: '#459c98',
          600: '#3a8280',
          700: '#306968',
          800: '#255150',
          900: '#1b3938',
          950: '#0d1d1d',
        },
        secondary: {
          DEFAULT: '#f28f80',
          50: '#fef2f0',
          100: '#fde6e2',
          200: '#fbd0c9',
          300: '#f8b0a4',
          400: '#f28f80',
          500: '#ea6f5c',
          600: '#d44b36',
          700: '#b13a28',
          800: '#933225',
          900: '#7a2e24',
          950: '#411512',
        },
        dark: {
          DEFAULT: '#2e3d3c',
          50: '#f4f6f6',
          100: '#e3e7e7',
          200: '#c9d1d0',
          300: '#a5b1b0',
          400: '#7c8c8b',
          500: '#5f706f',
          600: '#4b5958',
          700: '#3f4a49',
          800: '#2e3d3c',
          900: '#2a3332',
          950: '#171e1e',
        },
        light: {
          DEFAULT: '#d9e3e2',
          50: '#f7fafa',
          100: '#f0f4f4',
          200: '#e2eaea',
          300: '#d9e3e2',
          400: '#b4c6c4',
          500: '#92aba8',
          600: '#738d8a',
          700: '#5c7270',
          800: '#4d5e5c',
          900: '#3e4a49',
          950: '#1f2524',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'Roboto', 'Arial', 'sans-serif'],
        'serif': ['Merriweather', 'Georgia', 'serif'],
        'display': ['Poppins', 'Arial', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 7px 14px 0 rgba(65, 69, 88, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.07)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.dark.DEFAULT'),
            a: {
              color: theme('colors.primary.DEFAULT'),
              '&:hover': {
                color: theme('colors.primary.600'),
              },
            },
            h1: {
              color: theme('colors.dark.800'),
              fontFamily: theme('fontFamily.display').join(', '),
            },
            h2: {
              color: theme('colors.dark.800'),
              fontFamily: theme('fontFamily.display').join(', '),
            },
            h3: {
              color: theme('colors.dark.800'),
              fontFamily: theme('fontFamily.display').join(', '),
            },
            h4: {
              color: theme('colors.dark.800'),
              fontFamily: theme('fontFamily.display').join(', '),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
} 