<template>
  <div class="relative cursor-pointer" @click="$emit('imageClick')">
    <img
      :src="imageUrl"
      :alt="alt"
      class="w-full h-96 object-cover "
      @error="handleImageError"
    />

    <!-- <div>
      <video width="600" controls autoplay muted loop class="w-full h-96 object-cover ">
        <source
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          type="video/mp4"
        />
        <source
          src="https://www.w3schools.com/html/mov_bbb.ogg"
          type="video/ogg"
        />
        Tarayıcınız video etiketini desteklemiyor.
      </video>
    </div> -->

    <!-- Category Badge -->
    <div v-if="category" class="absolute top-4 left-4">
      <CategoryBadge :category="category" />
    </div>
  </div>
</template>

<script setup>
import CategoryBadge from "../Categories/CategoryBadge.vue";

const props = defineProps({
  imageUrl: { type: String, required: true },
  alt: { type: String, default: "" },
  category: { type: String, default: null },
});

defineEmits(["imageClick"]);

const handleImageError = (event) => {
  // Fallback image
  event.target.src = "https://picsum.photos/600/400";
};
</script>