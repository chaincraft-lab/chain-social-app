<template>
  <section class="mb-8">
    <div class="p-4">
      <div
        class="flex gap-4 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        <!-- Loading State for Stories -->
        <div v-if="isLoading" class="flex gap-4">
          <div
            v-for="n in 5"
            :key="n"
            class="flex flex-col items-center min-w-[80px]"
          >
            <div
              class="w-15 h-15 theme-bg-tertiary rounded-full animate-pulse mb-2"
            ></div>
            <div class="w-12 h-3 theme-bg-tertiary rounded animate-pulse"></div>
          </div>
        </div>

        <!-- Actual Stories -->
        <template v-else-if="stories && stories.length">
          <div
            v-for="story in stories.slice(0, 5)"
            :key="story.id"
            @click="$emit('storyClick', story)"
            class="flex flex-col items-center min-w-[80px] cursor-pointer group"
          >
            <div class="relative w-15 h-15 mb-2">
              <div
                class="w-full h-full rounded-full border-3 border-primary p-0.5 group-hover:scale-105 transition-transform"
              >
                <img
                  :src="story.image || story.imageUrl"
                  :alt="story.category?.name"
                  class="w-full h-full rounded-full object-cover"
                  @error="$event.target.src = '/placeholder-image.jpg'"
                />
              </div>
            </div>
            <div class="text-xs text-center theme-text-secondary font-medium">
              {{ story.category?.name || "Haber" }}
            </div>
          </div>
        </template>

        <!-- Empty State -->
        <div
          v-else
          class="flex justify-center items-center min-h-[80px] w-full"
        >
          <p class="theme-text-muted">Öne çıkan haber bulunamadı</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  stories: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["storyClick"]);
</script>

<style scoped>
/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .min-w-\[80px\] {
    min-width: 70px;
  }

  .w-15 {
    width: 50px;
    height: 50px;
  }

  .text-xs {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .p-4 {
    padding: 0.75rem;
  }

  .gap-4 {
    gap: 0.75rem;
  }
}

/* Custom scrollbar - tema aware */
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}

.scrollbar-track-gray-100::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
  border-radius: 2px;
}

.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
  background: var(--color-border-secondary);
  border-radius: 2px;
}

.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

/* Custom border width for story border */
.border-3 {
  border-width: 3px;
}

/* Custom width/height for story avatar */
.w-15 {
  width: 3.75rem;
}

.h-15 {
  height: 3.75rem;
}
</style>