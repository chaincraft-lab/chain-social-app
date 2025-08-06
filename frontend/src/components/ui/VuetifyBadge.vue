<template>
  <v-chip
    :color="vuetifyColor"
    :size="vuetifySize"
    :variant="vuetifyVariant"
    :rounded="vuetifyRounded"
    :class="[customClasses, className]"
  >
    <slot></slot>
  </v-chip>
</template>

<script>
export default {
  name: 'VuetifyBadge',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    rounded: {
      type: String,
      default: 'md',
      validator: (value) => ['none', 'sm', 'md', 'lg', 'full'].includes(value)
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    vuetifyColor() {
      const colorMap = {
        'primary': 'primary',
        'secondary': 'secondary',
        'success': 'success',
        'danger': 'error',
        'warning': 'warning',
        'info': 'info',
        'light': 'surface-variant',
        'dark': 'dark-surface'
      }
      return colorMap[this.variant] || 'primary'
    },
    
    vuetifySize() {
      const sizeMap = {
        'sm': 'small',
        'md': 'default',
        'lg': 'large'
      }
      return sizeMap[this.size] || 'default'
    },
    
    vuetifyVariant() {
      return 'flat'
    },
    
    vuetifyRounded() {
      const roundedMap = {
        'none': 0,
        'sm': 'sm',
        'md': 'lg',
        'lg': 'lg',
        'full': 'pill'
      }
      return roundedMap[this.rounded] || 'pill'
    },
    
    customClasses() {
      return ''
    }
  }
}
</script>

<style scoped>
:deep(.v-chip) {
  font-weight: 500;
}
</style>