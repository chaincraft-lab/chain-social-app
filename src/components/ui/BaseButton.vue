<template>
  <button
    :class="[
      'transition-all duration-200 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50',
      sizeClasses,
      variantClasses,
      roundedClasses,
      { 'opacity-50 cursor-not-allowed': disabled },
      { 'inline-flex items-center justify-center': $slots.icon || loading },
      className
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <span v-if="$slots.icon && !loading" class="mr-2">
      <slot name="icon"></slot>
    </span>
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
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
    variantClasses() {
      const variants = {
        primary: 'bg-primary hover:bg-primary/90 text-light focus:ring-primary/50',
        secondary: 'bg-secondary hover:bg-secondary/90 text-dark focus:ring-secondary/50',
        success: 'bg-green-500 hover:bg-green-600 text-light focus:ring-green-500/50',
        danger: 'bg-red-500 hover:bg-red-600 text-light focus:ring-red-500/50',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-light focus:ring-yellow-500/50',
        info: 'bg-blue-500 hover:bg-blue-600 text-light focus:ring-blue-500/50',
        light: 'bg-light hover:bg-light/80 text-dark focus:ring-light/50',
        dark: 'bg-dark hover:bg-dark/90 text-light focus:ring-dark/50',
        link: 'bg-transparent text-primary hover:underline focus:ring-primary/50',
        'outline-primary': 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-light focus:ring-primary/50',
        'outline-secondary': 'bg-transparent border border-secondary text-secondary hover:bg-secondary hover:text-dark focus:ring-secondary/50'
      }
      
      return variants[this.variant] || variants.primary
    },
    sizeClasses() {
      const sizes = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-5 py-2.5 text-lg',
        xl: 'px-6 py-3 text-xl'
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