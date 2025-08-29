<!-- components/NewsItem.vue -->
<template>
  <li class="py-4">
    <router-link
      :to="{ name: 'article', params: { slug: news.slug } }"
      class="flex items-start gap-4 group hover:theme-bg-secondary rounded-lg p-3 -m-3 transition-colors"
    >
      <!-- News Image -->
      <div
        class="flex-shrink-0 w-20 h-20 theme-bg-tertiary rounded-lg overflow-hidden"
      >
        <img
          :src="news.image"
          :alt="news.title"
          class="w-full h-full object-cover"
          @error="$event.target.src = 'https://picsum.photos/80/80'"
        />
      </div>

      <!-- News Content -->
      <div class="flex-1 min-w-0">
        <span class="text-sm text-primary font-medium">
          {{ formattedDate }}
        </span>
        <SimpleTooltip 
          v-if="shouldShowTooltip"
          :content="news.title"
          width="250px"
          position="top"
        >
          <h4
            :class="[
              'font-medium theme-text-primary group-hover:text-primary transition-colors line-clamp-2 mt-1',
              titleSizeClass
            ]"
          >
            {{ truncatedTitle }}
          </h4>
        </SimpleTooltip>
        <h4
          v-else
          :class="[
            'font-medium theme-text-primary group-hover:text-primary transition-colors line-clamp-2 mt-1',
            titleSizeClass
          ]"
        >
          {{ news.title }}
        </h4>
      </div>
    </router-link>
  </li>
</template>

<script setup>
import { computed } from "vue";
import SimpleTooltip from "../../common/SimpleTooltip.vue";

const props = defineProps({
  news: { type: Object, required: true },
  index: { type: Number, required: true },
  titleSize: { 
    type: String, 
    default: 'base',
    validator: value => ['xs', 'sm', 'base', 'lg'].includes(value)
  },
  maxTitleLength: {
    type: Number,
    default: 60
  }
});

const formattedDate = computed(() => {
  if (!props.news.date) return "";
  const date = new Date(props.news.date);
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
});

const titleSizeClass = computed(() => {
  const sizeMap = {
    xs: 'text-xs',
    sm: 'text-sm', 
    base: 'text-base',
    lg: 'text-lg'
  };
  return sizeMap[props.titleSize] || sizeMap.base;
});

const shouldShowTooltip = computed(() => {
  return props.news.title && props.news.title.length > props.maxTitleLength;
});

const truncatedTitle = computed(() => {
  if (!shouldShowTooltip.value) return props.news.title;
  return props.news.title.substring(0, props.maxTitleLength) + '...';
});

// Debug removed
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
