<template>
  <v-btn
    :variant="vuetifyVariant"
    :size="vuetifySize"
    :color="vuetifyColor"
    :disabled="disabled || loading"
    :loading="loading"
    :rounded="vuetifyRounded"
    :class="[customClasses, className]"
    @click="$emit('click', $event)"
  >
    <template v-if="$slots.icon" #prepend>
      <slot name="icon"></slot>
    </template>
    
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  name: 'VuetifyButton',
  emits: ['click'],
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link', 'outline-primary', 'outline-secondary'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    rounded: {
      type: String,
      default: 'md',
      validator: (value) => ['none', 'sm', 'md', 'lg', 'full'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    vuetifyVariant() {
      const variantMap = {
        'primary': 'flat',
        'secondary': 'flat',
        'success': 'flat',
        'danger': 'flat',
        'warning': 'flat',
        'info': 'flat',
        'light': 'flat',
        'dark': 'flat',
        'link': 'text',
        'outline-primary': 'outlined',
        'outline-secondary': 'outlined'
      }
      return variantMap[this.variant] || 'flat'
    },
    
    vuetifyColor() {
      const colorMap = {
        'primary': 'primary',
        'secondary': 'secondary',
        'success': 'success',
        'danger': 'error',
        'warning': 'warning',
        'info': 'info',
        'light': 'surface-variant',
        'dark': 'dark-surface',
        'link': 'primary',
        'outline-primary': 'primary',
        'outline-secondary': 'secondary'
      }
      return colorMap[this.variant] || 'primary'
    },
    
    vuetifySize() {
      const sizeMap = {
        'sm': 'small',
        'md': 'default',
        'lg': 'large',
        'xl': 'x-large'
      }
      return sizeMap[this.size] || 'default'
    },
    
    vuetifyRounded() {
      const roundedMap = {
        'none': 0,
        'sm': 'sm',
        'md': 'lg',
        'lg': 'lg',
        'full': 'pill'
      }
      return roundedMap[this.rounded] || 'lg'
    },
    
    customClasses() {
      let classes = ''
      
      // Add any custom styling that Vuetify doesn't handle
      if (this.variant === 'link') {
        classes += 'text-decoration-none '
      }
      
      return classes.trim()
    }
  }
}
</script>

<style scoped>
/* Custom styles to match your theme */
:deep(.v-btn) {
  font-weight: 500;
  text-transform: none;
}

:deep(.v-btn--variant-text) {
  text-decoration: none;
}
</style>