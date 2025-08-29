<template>
  <div class="feed-header flex justify-between items-center mb-6 px-2">
    <h2 class="text-2xl font-bold theme-text-primary m-0">{{ title }}</h2>

    <!-- <div class="feed-filter flex gap-2">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="$emit('update:selectedFilter', filter.value)"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-colors',
          selectedFilter === filter.value
            ? 'bg-primary text-white'
            : 'theme-bg-tertiary theme-text-secondary hover:theme-bg-secondary'
        ]"
      >
        {{ filter.label }}
      </button>
    </div> -->
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "Son Haberler",
  },
  selectedFilter: {
    type: String,
    default: "all",
  },
});

defineEmits(["update:selectedFilter"]);
</script>

<style scoped>
/* Mobile Responsive */
@media (max-width: 768px) {
  .feed-header {
    flex-direction: column !important;
    gap: 1rem;
    align-items: flex-start !important;
  }

  .feed-header h2 {
    font-size: 1.25rem !important;
  }
}

@media (max-width: 480px) {
  .feed-header {
    padding: 0 0.25rem !important;
  }
}
</style>