<!-- components/common/SkeletonLoader.vue -->
<template>
  <div class="flex flex-wrap gap-2">
    <div
      v-for="i in count"
      :key="i"
      class="h-7 bg-gray-200 rounded-full animate-pulse"
      :style="{ width: Math.random() * 60 + 80 + 'px' }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'SkeletonLoader',
  props: {
    count: { type: Number, default: 6 }
  }
}
</script>
