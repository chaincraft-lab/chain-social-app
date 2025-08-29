<template>
  <div class="news-header">
    <!-- Filter Panel Integration -->
    <NewsFilterPanel 
      :title="title"
      :results-count="resultsCount"
      @filter-change="handleFilterChange"
    />
  </div>
</template>

<script setup>
import NewsFilterPanel from './NewsFilterPanel.vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: "Son Haberler",
  },
  resultsCount: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['filter-change'])

// Methods
const handleFilterChange = (filters) => {
  emit('filter-change', filters)
}
</script>

<style scoped>
/* Mobile Responsive */
@media (max-width: 768px) {
  .feed-header {
    flex-direction: column !important;
    gap: 1rem;
    align-items: flex-start !important;
  }

  .feed-header h1 {
    font-size: 1.25rem !important;
  }
}

@media (max-width: 480px) {
  .feed-header {
    padding: 0 0.25rem !important;
  }
}
</style>