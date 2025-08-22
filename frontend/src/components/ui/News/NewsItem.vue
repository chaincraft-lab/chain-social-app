<!-- components/NewsItem.vue -->
<template>
  <li class="py-3">
    <router-link
      :to="{ name: 'article', params: { slug: news.slug } }"
      class="flex items-start gap-3 group hover:theme-bg-secondary rounded-lg p-2 -m-2 transition-colors"
    >
      <!-- News Image -->
      <div
        class="flex-shrink-0 w-16 h-16 theme-bg-tertiary rounded-lg overflow-hidden"
      >
        <img
          :src="news.image"
          :alt="news.title"
          class="w-full h-full object-cover"
          @error="$event.target.src = 'https://picsum.photos/64/64'"
        />
      </div>

      <!-- News Content -->
      <div class="flex-1 min-w-0">
        <span class="text-xs text-primary font-medium">
          {{ formattedDate }}
        </span>
        <h4
          class="text-sm font-medium theme-text-primary group-hover:text-primary transition-colors line-clamp-2 mt-1"
        >
          {{ news.title }}
        </h4>
      </div>

      <!-- Index Badge -->
      <!-- <div
        class="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-semibold text-white"
      >
        {{ index + 1 }}
      </div> -->
    </router-link>
  </li>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  news: { type: Object, required: true },
  index: { type: Number, required: true },
});

const formattedDate = computed(() => {
  if (!props.news.date) return "";
  const date = new Date(props.news.date);
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
