/**
 * Merkezi Tema Konfigürasyonu
 * 
 * Bu dosyada projenin tüm renkleri tanımlanır.
 * Renkler hem CSS değişkenleri hem de JavaScript'ten erişilebilir.
 */

// Ana tema renkleri
export const THEME_COLORS = {
  // === ANA TEMA RENKLERİ ===
  primary: {
    name: 'Primary (Ash Gray)',
    DEFAULT: '#6B7280', // Modern kül grisi
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280', // Ana kül rengi
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },
  
  secondary: {
    name: 'Secondary (Açık Mavi)',
    DEFAULT: '#B0C4DE',
    50: '#f0f7ff',
    100: '#e0efff',
    200: '#bae0ff',
    300: '#7cc8ff',
    400: '#37adff',
    500: '#0d94ff',
    600: '#0074e0',
    700: '#005db5',
    800: '#004b95',
    900: '#B0C4DE',
    950: '#002a54',
  },
  
  accent: {
    name: 'Accent (Teal)',
    DEFAULT: '#459c98',
    50: '#f0fdfc',
    100: '#ccfdf7',
    200: '#99f9f0',
    300: '#5eeee6',
    400: '#2dd9d2',
    500: '#14bdb8',
    600: '#0d9b98',
    700: '#0f7c7a',
    800: '#459c98',
    900: '#164e4b',
    950: '#042f2e',
  },

  // === SİSTEM RENKLERİ ===
  success: {
    name: 'Success (Yeşil)',
    DEFAULT: '#10b981',
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#10b981',
    700: '#059669',
    800: '#047857',
    900: '#065f46',
    950: '#022c22',
  },
  
  error: {
    name: 'Error (Kırmızı)',
    DEFAULT: '#ef4444',
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  
  warning: {
    name: 'Warning (Turuncu)',
    DEFAULT: '#f59e0b',
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  info: {
    name: 'Info (Mavi)',
    DEFAULT: '#3b82f6',
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // === TEMA YARDIMCI RENKLERİ ===
  dark: {
    name: 'Dark (Lacivert)',
    DEFAULT: '#0A1F44',
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0A1F44',
    950: '#020617',
  },

  navbar: {
    name: 'Navbar (Koyu Gri)',
    DEFAULT: '#111827', // gray-900 rengi
    bg: '#111827',
    text: '#FFFFFF',
    border: '#374151', // gray-700
  },

  auth: {
    name: 'Auth Button (İndigo)',
    DEFAULT: '#6366f1', // indigo-500
    bg: '#6366f1',
    hover: '#4f46e5', // indigo-600
    text: '#FFFFFF',
  },
  
  light: {
    name: 'Light (Beyaz)',
    DEFAULT: '#FFFFFF',
    50: '#FFFFFF',
    100: '#f9fafb',
    200: '#f3f4f6',
    300: '#e5e7eb',
    400: '#d1d5db',
    500: '#9ca3af',
    600: '#6b7280',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  
  altmenu: {
    name: 'Alt Menu (Koyu Gri)',
    DEFAULT: '#2F2F2F',
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#2F2F2F',
    900: '#18181b',
    950: '#09090b',
  },

  // === GRAY PALETI ===
  gray: {
    name: 'Gray (Nötr)',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
}

// Light Mode tema renkleri
export const LIGHT_MODE_THEME = {
  // Ana renk paleti
  primary: '#6B7280', // Kül grisi (mevcut)
  
  // Text renkler
  text: {
    primary: '#111827',
    secondary: '#4B5563', 
    muted: '#6B7280',
    inverse: '#FFFFFF'
  },
  
  // Background renkler
  bg: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    card: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)'
  },
  
  // Border renkler
  border: {
    primary: '#E5E7EB',
    secondary: '#D1D5DB',
    muted: '#F3F4F6'
  },
  
  // Navbar renkleri (light mode)
  navbar: {
    bg: '#FFFFFF',
    text: '#111827', 
    border: '#E5E7EB',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  
  // Auth button renkleri (mevcut)
  auth: {
    bg: '#6366f1', // indigo-500
    hover: '#4f46e5', // indigo-600
    text: '#FFFFFF',
    border: '#6366f1'
  },
  
  // System renkler
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6'
}

// Dark Mode tema renkleri
export const DARK_MODE_THEME = {
  // Ana renk paleti
  primary: '#9CA3AF', // Dark mode'da daha açık kül
  
  // Text renkler
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
    muted: '#9CA3AF',
    inverse: '#111827'
  },
  
  // Background renkler
  bg: {
    primary: '#111827',
    secondary: '#1F2937',
    tertiary: '#374151',
    card: '#1F2937',
    overlay: 'rgba(0, 0, 0, 0.8)'
  },
  
  // Border renkler
  border: {
    primary: '#374151',
    secondary: '#4B5563',
    muted: '#1F2937'
  },
  
  // Navbar renkleri (mevcut - dark mode)
  navbar: {
    bg: '#111827', // mevcut navbar bg
    text: '#FFFFFF',
    border: '#374151', // mevcut navbar border
    shadow: 'rgba(0, 0, 0, 0.3)'
  },
  
  // Auth button renkleri (mevcut - dark mode'da aynı)
  auth: {
    bg: '#6366f1', // indigo-500
    hover: '#4f46e5', // indigo-600  
    text: '#FFFFFF',
    border: '#6366f1'
  },
  
  // System renkler (dark mode'da daha yumuşak)
  success: '#34d399',
  error: '#f87171', 
  warning: '#fbbf24',
  info: '#60a5fa'
}

// CSS değişkenleri için renk değerlerini hazırla
export const CSS_VARIABLES = Object.keys(THEME_COLORS).reduce((acc, colorKey) => {
  const colorPalette = THEME_COLORS[colorKey]
  
  Object.keys(colorPalette).forEach(shade => {
    if (shade !== 'name') {
      const variableName = shade === 'DEFAULT' 
        ? `--color-${colorKey}` 
        : `--color-${colorKey}-${shade}`
      acc[variableName] = colorPalette[shade]
    }
  })
  
  return acc
}, {})

// Tema yönetimi fonksiyonları
export const themeUtils = {
  /**
   * Aktif temayı döndürür (light/dark)
   * @param {boolean} isDark - Dark mode aktif mi?
   * @returns {Object} Tema renkleri
   */
  getTheme(isDark = false) {
    return isDark ? DARK_MODE_THEME : LIGHT_MODE_THEME
  },

  /**
   * CSS değişkenini döndürür
   * @param {string} color - Renk adı (primary, secondary, vb.)
   * @param {string|number} shade - Renk tonu (50, 100, 200, vb. veya DEFAULT)
   * @returns {string} CSS değişken referansı
   */
  getCSSVariable(color, shade = 'DEFAULT') {
    const variableName = shade === 'DEFAULT' 
      ? `--color-${color}` 
      : `--color-${color}-${shade}`
    return `var(${variableName})`
  },

  /**
   * Temadan renk alır
   * @param {boolean} isDark - Dark mode aktif mi?
   * @param {string} path - Renk path'i (örn: 'text.primary', 'navbar.bg')
   * @returns {string} Hex renk değeri
   */
  getThemeColor(isDark, path) {
    const theme = this.getTheme(isDark)
    const keys = path.split('.')
    let color = theme
    
    for (const key of keys) {
      color = color?.[key]
      if (!color) break
    }
    
    return color || '#000000'
  },

  /**
   * Hex renk değerini döndürür (eski renkler için)
   * @param {string} color - Renk adı
   * @param {string|number} shade - Renk tonu
   * @returns {string} Hex renk değeri
   */
  getHexColor(color, shade = 'DEFAULT') {
    return THEME_COLORS[color]?.[shade] || '#000000'
  },

  /**
   * RGB değerlerini döndürür (Tailwind opacity desteği için)
   * @param {string} hexColor - Hex renk değeri
   * @returns {string} RGB değerleri (örn: "128 0 0")
   */
  hexToRgb(hexColor) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor)
    return result 
      ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
      : '0 0 0'
  },

  /**
   * Dark mode için CSS class'ları oluşturur
   * @returns {Object} CSS variables
   */
  generateCSSVariables(isDark = false) {
    const theme = this.getTheme(isDark)
    const variables = {}
    
    // Flatten theme object
    const flatten = (obj, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const value = obj[key]
        const cssVar = prefix ? `${prefix}-${key}` : key
        
        if (typeof value === 'object' && value !== null) {
          flatten(value, cssVar)
        } else {
          variables[`--theme-${cssVar}`] = value
        }
      })
    }
    
    flatten(theme)
    return variables
  },

  /**
   * Tüm tema renklerinin listesini döndürür
   * @returns {Object} Tema renkleri
   */
  getAllColors() {
    return THEME_COLORS
  },

  /**
   * Tema değişkeni yaratır
   * @param {Object} customColors - Özel renk paleti
   * @returns {Object} Güncellenmiş tema
   */
  createThemeVariant(customColors = {}) {
    return {
      ...THEME_COLORS,
      ...customColors
    }
  }
}

// Örnek kullanım:
// themeUtils.getTheme(false) → Light mode renkleri
// themeUtils.getTheme(true) → Dark mode renkleri
// themeUtils.getThemeColor(false, 'navbar.bg') → '#FFFFFF' (light mode navbar bg)
// themeUtils.getThemeColor(true, 'navbar.bg') → '#111827' (dark mode navbar bg)
// themeUtils.getThemeColor(false, 'auth.bg') → '#6366f1' (auth button bg)

export default {
  colors: THEME_COLORS,
  lightTheme: LIGHT_MODE_THEME,
  darkTheme: DARK_MODE_THEME,
  cssVariables: CSS_VARIABLES,
  utils: themeUtils
}