<template>
  <div 
    :class="[
      'overflow-hidden',
      roundedClasses,
      shadowClasses,
      hoverClasses,
      { 'border border-gray-200': border },
      className
    ]"
  >
    <div v-if="$slots.image" class="w-full">
      <slot name="image"></slot>
    </div>
    
    <div v-if="$slots.header" :class="['px-4 py-3', headerClass]">
      <slot name="header"></slot>
    </div>
    
    <div :class="['px-4 py-4', bodyClass]">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" :class="['px-4 py-3', footerClass]">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    rounded: {
      type: String,
      default: 'md',
      validator: (value) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    shadow: {
      type: String,
      default: 'md',
      validator: (value) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    hover: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    },
    headerClass: {
      type: String,
      default: 'border-b border-gray-200 bg-gray-50'
    },
    bodyClass: {
      type: String,
      default: 'bg-white'
    },
    footerClass: {
      type: String,
      default: 'border-t border-gray-200 bg-gray-50'
    }
  },
  computed: {
    roundedClasses() {
      const rounded = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl'
      }
      
      return rounded[this.rounded] || rounded.md
    },
    shadowClasses() {
      const shadow = {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow',
        lg: 'shadow-md',
        xl: 'shadow-lg'
      }
      
      return shadow[this.shadow] || shadow.md
    },
    hoverClasses() {
      return this.hover ? 'transition-all duration-300 hover:shadow-lg' : ''
    }
  }
}
</script> 