<template>
  <span
    :class="[
      'inline-flex items-center justify-center',
      sizeClasses,
      variantClasses,
      roundedClasses,
      className
    ]"
  >
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'BaseBadge',
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
    variantClasses() {
      const variants = {
        primary: 'bg-primary text-light',
        secondary: 'bg-secondary text-dark',
        success: 'bg-green-500 text-light',
        danger: 'bg-red-500 text-light',
        warning: 'bg-yellow-500 text-light',
        info: 'bg-blue-500 text-light',
        light: 'bg-light text-dark',
        dark: 'bg-dark text-light'
      }
      
      return variants[this.variant] || variants.primary
    },
    sizeClasses() {
      const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base'
      }
      
      return sizes[this.size] || sizes.md
    },
    roundedClasses() {
      const rounded = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full'
      }
      
      return rounded[this.rounded] || rounded.md
    }
  }
}
</script> 