import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

// Custom theme matching your existing design
const customTheme = {
  dark: false,
  colors: {
    // Primary colors from your existing design
    primary: '#800000', // Bordo
    secondary: '#B0C4DE', // Açık mavi
    accent: '#459c98', // Teal
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    success: '#10b981',
    
    // Surface colors
    surface: '#FFFFFF',
    'surface-variant': '#f5f5f5',
    'on-surface': '#2e3d3c', // Dark green
    'on-surface-variant': '#666666',
    
    // Background colors
    background: '#FFFFFF',
    'on-background': '#2e3d3c',
    
    // Additional custom colors
    'dark-surface': '#0A1F44', // Lacivert
    'alt-menu': '#2F2F2F', // Koyu gri
    'light-gray': '#d9e3e2'
  },
  variables: {
    // Border radius
    'border-radius-root': '8px',
    'border-radius-sm': '4px',
    'border-radius-lg': '12px',
    'border-radius-xl': '16px',
    
    // Shadows
    'shadow-key-umbra-opacity': '0.1',
    'shadow-key-penumbra-opacity': '0.05',
    
    // Typography
    'font-size-root': '16px',
    'line-height-root': '1.5'
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme
    }
  },
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi
    }
  },
  defaults: {
    // Global component defaults to match your design
    VBtn: {
      style: [
        {
          textTransform: 'none', // Remove uppercase transformation
          fontWeight: '500'
        }
      ],
      rounded: 'lg'
    },
    VCard: {
      rounded: 'lg',
      elevation: 2
    },
    VTextField: {
      rounded: 'lg',
      variant: 'outlined',
      density: 'comfortable'
    },
    VSelect: {
      rounded: 'lg', 
      variant: 'outlined',
      density: 'comfortable'
    },
    VTextarea: {
      rounded: 'lg',
      variant: 'outlined'
    },
    VChip: {
      rounded: 'pill'
    },
    VDialog: {
      rounded: 'lg'
    },
    VSheet: {
      rounded: 'lg'
    }
  },
  display: {
    mobileBreakpoint: 'md',
    thresholds: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  }
})