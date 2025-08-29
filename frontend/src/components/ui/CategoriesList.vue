<template>
  <div v-if="showCategories" class="theme-card rounded-lg shadow-sm mb-4">
    <!-- Header -->
    <SectionHeader title="Kategoriler">
      <template #icon>
        <Icon icon="heroicons:folder" class="w-6 h-6 mr-2 text-primary" />
      </template>
    </SectionHeader>

    <!-- Categories Content -->
    <div class="p-3">
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-2">
        <SkeletonLoader v-for="i in 4" :key="i" type="list" />
      </div>

      <!-- Categories List -->
      <div v-else-if="categories && categories.length > 0">
        <CategoryItem
          v-for="category in categories"
          :key="category.id"
          :category="category"
        />
      </div>

      <!-- Empty State -->
      <EmptyState 
        v-else
        message="Henüz kategori bulunmuyor"
      />
    </div>
  </div>
</template>

<script setup>
import SectionHeader from '../common/SectionHeader.vue'
import CategoryItem from './Categories/CategoryItem.vue'
import EmptyState from '../common/EmptyState.vue'
import SkeletonLoader from '../common/SkeletonLoader.vue'

defineProps({
  categories: { type: Array, required: true },
  showCategories: { type: Boolean, default: true },
  isLoading: { type: Boolean, default: false }
})
</script>


<style scoped>
</style>