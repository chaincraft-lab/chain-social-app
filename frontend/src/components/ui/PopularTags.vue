<template>
<div v-if="props.showTags" class="bg-white rounded-lg shadow-sm mb-6">
    <!-- Header -->
    <SectionHeader title="Popüler Etiketler">
      <template #icon>
        <svg
          class="w-5 h-5 mr-2 text-primary"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 2 2 2h11c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"
          />
        </svg>
      </template>
    </SectionHeader>

    <!-- Tags Content -->
    <div class="p-4">
      <!-- Loading State -->
      <SkeletonLoader v-if="isTagsLoading" :count="6" />

      <!-- Tags List -->
      <div v-else-if="tags.length > 0" class="flex flex-wrap gap-2">
        <TagChip
          v-for="tag in tags"
          :key="tag.id"
          :label="tag.name"
          :to="{ name: 'tag', params: { slug: tag.slug } }"
        />
      </div>

      <!-- Empty State -->
      <EmptyState v-else message="Henüz etiket bulunmuyor" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

import SectionHeader from "../common/SectionHeader.vue";
import TagChip from "./Tags/TagChip.vue";
import EmptyState from "../common/EmptyState.vue";
import SkeletonLoader from "../common/SkeletonLoader.vue";

const props = defineProps({
  showTags: { type: Boolean, default: true }
})

const store = useStore();

const tags = computed(() => store.state.tags.popularTags || []);
const isTagsLoading = computed(() =>
  store.getters["tags/isLoading"]("popular")
);

onMounted(() => {
  if (props.showTags && (!tags.value || tags.value.length === 0)) {
    store.dispatch('tags/fetchPopularTags', 10)
  }
})
</script>
