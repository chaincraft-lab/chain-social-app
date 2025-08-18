<template>
  <div class="flex items-center mb-6">
    <div class="w-12 h-12 rounded-full overflow-hidden mr-3">
      <img 
        :src="authorImage" 
        :alt="authorName"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
    </div>
    <div>
      <div class="font-medium text-gray-900">{{ authorName }}</div>
      <div class="text-sm text-gray-600">{{ authorRole }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  author: { type: Object, required: true }
})

const authorName = computed(() => {
  if (props.author?.name) return props.author.name
  if (props.author?.firstName && props.author?.lastName) {
    return `${props.author.firstName} ${props.author.lastName}`
  }
  return 'Yazar'
})

const authorRole = computed(() => {
  return props.author?.role || 'Editör'
})

const authorImage = computed(() => {
  return props.author?.profileImage || 
         props.author?.avatar || 
         'https://i.pravatar.cc/100'
})

const handleImageError = (event) => {
  event.target.src = 'https://i.pravatar.cc/100'
}
</script>