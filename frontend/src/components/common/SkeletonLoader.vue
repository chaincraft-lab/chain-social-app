<template>
  <!-- Tag Pills Skeleton (default) -->
  <div v-if="type === 'tags'" class="flex flex-wrap gap-2">
    <div
      v-for="i in count"
      :key="i"
      class="h-7 theme-bg-tertiary rounded-full animate-pulse"
      :style="{ width: Math.random() * 60 + 80 + 'px' }"
    ></div>
  </div>

  <!-- News Card Skeleton -->
  <div v-else-if="type === 'news'" class="theme-card rounded-lg p-4 animate-pulse">
    <!-- Image -->
    <div class="w-full h-48 theme-bg-tertiary rounded-lg mb-4"></div>
    <!-- Title -->
    <div class="h-4 theme-bg-tertiary rounded mb-2"></div>
    <div class="h-4 theme-bg-tertiary rounded w-3/4 mb-3"></div>
    <!-- Meta info -->
    <div class="flex items-center justify-between">
      <div class="h-3 theme-bg-tertiary rounded w-1/4"></div>
      <div class="h-3 theme-bg-tertiary rounded w-1/6"></div>
    </div>
  </div>

  <!-- Popular News Item Skeleton -->
  <div v-else-if="type === 'popular-news'" class="flex space-x-3 p-3 animate-pulse">
    <!-- Number Badge -->
    <div class="w-6 h-6 theme-bg-tertiary rounded-full flex-shrink-0"></div>
    <!-- Content -->
    <div class="flex-1">
      <div class="h-4 theme-bg-tertiary rounded mb-2"></div>
      <div class="h-4 theme-bg-tertiary rounded w-2/3 mb-2"></div>
      <div class="h-3 theme-bg-tertiary rounded w-1/3"></div>
    </div>
  </div>

  <!-- List Item Skeleton -->
  <div v-else-if="type === 'list'" class="flex items-center space-x-3 p-3 animate-pulse">
    <div class="w-10 h-10 theme-bg-tertiary rounded-full flex-shrink-0"></div>
    <div class="flex-1">
      <div class="h-4 theme-bg-tertiary rounded mb-2"></div>
      <div class="h-3 theme-bg-tertiary rounded w-1/2"></div>
    </div>
  </div>

  <!-- Custom Rectangle Skeleton -->
  <div v-else-if="type === 'rectangle'" 
    class="theme-bg-tertiary animate-pulse"
    :class="[
      rounded === 'none' ? 'rounded-none' : 
      rounded === 'sm' ? 'rounded-sm' : 
      rounded === 'md' ? 'rounded-md' : 
      rounded === 'lg' ? 'rounded-lg' : 
      rounded === 'xl' ? 'rounded-xl' : 
      rounded === 'full' ? 'rounded-full' : 'rounded-md'
    ]"
    :style="customStyle"
  ></div>

  <!-- Default/Tags fallback -->
  <div v-else class="flex flex-wrap gap-2">
    <div
      v-for="i in count"
      :key="i"
      class="h-7 theme-bg-tertiary rounded-full animate-pulse"
      :style="{ width: Math.random() * 60 + 80 + 'px' }"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: { type: Number, default: 6 },
  type: { type: String, default: 'tags' }, // 'tags', 'news', 'popular-news', 'list', 'rectangle'
  width: { type: [String, Number], default: 'auto' },
  height: { type: [String, Number], default: 'auto' },
  rounded: { type: String, default: 'md' }
})

const customStyle = computed(() => {
  const style = {}
  
  if (props.width && props.width !== 'auto') {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  
  if (props.height && props.height !== 'auto') {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  return style
})
</script>
