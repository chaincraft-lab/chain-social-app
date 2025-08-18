<template>
  <div class="feed-header">
    <h2 class="feed-title">{{ title }}</h2>
    <div class="feed-filter">
      <v-chip-group 
        :model-value="selectedFilter" 
        @update:model-value="$emit('update:selectedFilter', $event)"
        color="primary" 
        variant="flat"
      >
        <v-chip 
          v-for="filter in filters" 
          :key="filter.value"
          :value="filter.value"
        >
          {{ filter.label }}
        </v-chip>
      </v-chip-group>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Son Haberler'
  },
  selectedFilter: {
    type: String,
    default: 'all'
  },
  filters: {
    type: Array,
    default: () => [
      { value: 'all', label: 'Tümü' },
      { value: 'trending', label: 'Trend' },
      { value: 'recent', label: 'Yeni' }
    ]
  }
})

defineEmits(['update:selectedFilter'])
</script>

<style scoped>
.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

.feed-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.87);
  margin: 0;
}

.feed-filter {
  display: flex;
  gap: 0.5rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .feed-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .feed-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .feed-header {
    padding: 0 0.25rem;
  }
}
</style>