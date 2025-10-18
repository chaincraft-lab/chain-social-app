<template>
  <div class="px-4 pb-3">
    <!-- Engagement Stats -->
    <div v-if="likesCount > 0" class="mb-2">
      <span class="text-sm font-semibold text-text-primary"
        >{{ formatCount(likesCount) }} beğeni</span
      >
    </div>

    <!-- Post Title and Content -->
    <div class="cursor-pointer" @click="$emit('contentClick')">
      <div class="text-2xl mb-2">
        <!-- <span class="font-semibold text-text-primary">{{ authorName }}</span> -->
        <span class="text-text-primary">{{ title }}</span>
      </div>

      <div v-if="excerpt" class="text-sm text-text-secondary mb-2">
        {{ excerpt }}
      </div>
    </div>

    <!-- Tags -->
    <div v-if="tags && tags.length" class="flex flex-wrap gap-2 mt-2">
      <span
        v-for="tag in tags.slice(0, 3)"
        :key="tag.id || tag"
        class="text-sm text-info hover:text-info-600 hover:underline transition-colors cursor-pointer"
      >
        #{{ tag.name || tag }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  authorName: { type: String, required: true },
  title: { type: String, required: true },
  excerpt: { type: String, default: null },
  tags: { type: Array, default: () => [] },
  likesCount: { type: Number, default: 0 },
});

defineEmits(["contentClick"]);

const formatCount = (count) => {
  if (count < 1000) return count.toString();
  if (count < 1000000) return (count / 1000).toFixed(1) + "B";
  return (count / 1000000).toFixed(1) + "M";
};
</script>