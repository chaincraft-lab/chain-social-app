<template>
  <div 
    class="relative inline-block"
    @mouseenter="handleMouseEnter"
    @mouseleave="show = false"
  >
    <!-- Trigger -->
    <slot />
    
    <!-- Tooltip -->
    <div
      v-if="show && props.content"
      :class="[
        'absolute z-50 px-3 py-2 text-sm theme-text-primary theme-bg-secondary rounded-lg shadow-lg border theme-border-primary',
        positionClasses
      ]"
      :style="tooltipStyles"
    >
      {{ props.content }}
      <!-- Arrow -->
      <div 
        :class="['absolute w-0 h-0', arrowClasses]"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: '200px'
  },
  position: {
    type: String,
    default: 'top',
    validator: value => ['top', 'bottom', 'left', 'right'].includes(value)
  }
})

const show = ref(false)

const handleMouseEnter = () => {
  show.value = true
}

// Position classes
const positionClasses = computed(() => {
  const positions = {
    top: '-top-10 left-1/2 transform -translate-x-1/2',
    bottom: '-bottom-10 left-1/2 transform -translate-x-1/2',
    left: 'top-1/2 -left-2 transform -translate-y-1/2 -translate-x-full',
    right: 'top-1/2 -right-2 transform -translate-y-1/2 translate-x-full'
  }
  return positions[props.position] || positions.top
})

// Arrow classes
const arrowClasses = computed(() => {
  const arrows = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-300',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-300',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-300',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-300'
  }
  return arrows[props.position] || arrows.top
})

// Dynamic styles
const tooltipStyles = computed(() => {
  const baseStyles = {
    width: props.width,
    whiteSpace: 'normal',
    wordWrap: 'break-word'
  }
  
  // Adjust margin for different positions
  if (props.position === 'top' || props.position === 'bottom') {
    baseStyles.marginLeft = `calc(-${props.width} / 2)`
  } else if (props.position === 'left') {
    baseStyles.marginRight = '8px'
  } else if (props.position === 'right') {
    baseStyles.marginLeft = '8px'
  }
  
  return baseStyles
})
</script>

<style scoped>
/* Prevent text overflow */
.max-w-xs {
  max-width: 20rem;
}
</style>