<template>
  <section class="stories-section">
    <v-card class="stories-card" elevation="1" rounded="xl">
      <div class="stories-container">
        <!-- Loading State for Stories -->
        <div v-if="isLoading" class="stories-loading">
          <v-skeleton-loader
            v-for="n in 5"
            :key="n"
            type="avatar"
            class="story-skeleton"
          ></v-skeleton-loader>
        </div>

        <!-- Actual Stories -->
        <div
          v-else-if="stories && stories.length"
          class="story-item"
          v-for="story in stories.slice(0, 5)"
          :key="story.id"
          @click="$emit('storyClick', story)"
        >
          <div class="story-avatar">
            <v-img
              :src="story.image || story.imageUrl"
              :alt="story.category?.name"
              cover
              class="story-image"
            ></v-img>
          </div>
          <div class="story-label">{{ story.category?.name || "Haber" }}</div>
        </div>

        <!-- Empty State -->
        <div v-else class="stories-empty">
          <p class="text-grey">Öne çıkan haber bulunamadı</p>
        </div>
      </div>
    </v-card>
  </section>
</template>

<script setup>
defineProps({
  stories: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['storyClick'])
</script>

<style scoped>
/* Stories Section */
.stories-section {
  margin-bottom: 2rem;
}

.stories-card {
  padding: 1rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.stories-container {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.story-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  cursor: pointer;
}

.story-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid var(--color-info-600);
  padding: 2px;
  margin-bottom: 0.5rem;
  transition: transform 0.2s ease;
}

.story-avatar:hover {
  transform: scale(1.05);
}

.story-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.story-label {
  font-size: 0.75rem;
  text-align: center;
  color: rgba(0, 0, 0, 0.7);
  font-weight: 500;
}

.stories-loading {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.story-skeleton {
  min-width: 60px;
  height: 60px;
}

.stories-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .stories-container {
    gap: 0.75rem;
  }

  .story-item {
    min-width: 70px;
  }

  .story-avatar {
    width: 50px;
    height: 50px;
  }

  .story-label {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .stories-card {
    padding: 0.75rem;
  }
}

/* Scrollbar for stories */
.stories-container::-webkit-scrollbar {
  height: 4px;
}

.stories-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.stories-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
}

.stories-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}
</style>