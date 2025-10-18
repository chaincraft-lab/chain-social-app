<template>
  <div class="relative cursor-pointer" @click="$emit('imageClick')">
    <!-- Image -->
    <img
      v-if="!isVideo"
      :src="imageUrl"
      :alt="alt"
      class="w-full h-96 object-cover"
      @error="handleImageError"
    />

    <!-- Video -->
    <video 
      v-else
      :src="imageUrl"
      controls 
      autoplay 
      muted 
      loop 
      class="w-full h-96 object-cover"
      @error="handleVideoError"
    >
      Tarayıcınız video etiketini desteklemiyor.
    </video>

    <!-- Category Badge -->
    <div v-if="category" class="absolute top-4 left-4">
      <CategoryBadge :category="category" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CategoryBadge from "../Categories/CategoryBadge.vue";

const props = defineProps({
  imageUrl: { type: String, required: true },
  alt: { type: String, default: "" },
  category: { type: String, default: null },
});

defineEmits(["imageClick"]);

// Check if the URL is a video
const isVideo = computed(() => {
  if (!props.imageUrl) return false
  
  const url = props.imageUrl.toLowerCase()
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv']
  
  // Check by file extension
  const hasVideoExtension = videoExtensions.some(ext => url.includes(ext))
  
  // Check by URL patterns (for streaming services, CDNs, etc.)
  const videoPatterns = [
    'video',
    'mp4',
    'webm',
    'stream',
    'media/video'
  ]
  
  const hasVideoPattern = videoPatterns.some(pattern => url.includes(pattern))
  
  return hasVideoExtension || hasVideoPattern
})

const handleImageError = (event) => {
  // Fallback image
  event.target.src = "https://picsum.photos/600/400";
};

const handleVideoError = (event) => {
  console.warn('Video load error:', event)
  // Could show a video error placeholder or fallback to image
};
</script>