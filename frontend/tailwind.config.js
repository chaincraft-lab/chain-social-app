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
          DEFAULT: '#800000', // Bordo (buton arka planı)
          50: '#f9e6e6',
          100: '#f0c4c4',
          200: '#e09e9e',
          300: '#cc7878',
          400: '#b85959',
          500: '#a33b3b',
          600: '#800000', // Ana renk
          700: '#6b0000',
          800: '#570000',
          900: '#430000',
          950: '#2e0000',
        },
        secondary: {
          DEFAULT: '#B0C4DE', // Açık mavi (hover rengi)
          50: '#f5f8fc',
          100: '#eaf0f8',
          200: '#d5e1f1',
          300: '#B0C4DE', // Ana renk
          400: '#8ba7cf',
          500: '#6d8bc1',
          600: '#5570b2',
          700: '#455ca3',
          800: '#3b4c85',
          900: '#34426a',
          950: '#232a43',
        },
        dark: {
          DEFAULT: '#0A1F44', // Lacivert (arka plan)
          50: '#e6eaf0',
          100: '#c2cad8',
          200: '#9aa7bf',
          300: '#7284a6',
          400: '#556994',
          500: '#3d5082',
          600: '#2e3f6f',
          700: '#1f2f5c',
          800: '#0A1F44', // Ana renk
          900: '#061536',
          950: '#030c24',
        },
        light: {
          DEFAULT: '#FFFFFF', // Beyaz (menü yazıları)
          50: '#FFFFFF', // Ana renk
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0d0d0d',
        },
        altmenu: {
          DEFAULT: '#2F2F2F', // Koyu gri (alt menü arka planı)
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#2F2F2F', // Ana renk
          900: '#1a1a1a',
          950: '#0d0d0d',
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
                color: theme('colors.secondary.DEFAULT'),
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