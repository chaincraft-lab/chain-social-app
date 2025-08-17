<template>
  <div class="aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden mb-8">
    <img 
      :src="imageUrl" 
      :alt="alt" 
      class="w-full h-full object-cover"
      @error="handleImageError"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  imageUrl: { type: String, required: true },
  alt: { type: String, default: 'Article image' }
})

const handleImageError = (event) => {
  event.target.src = 'https://picsum.photos/id/1015/1200/675'
}
</script>