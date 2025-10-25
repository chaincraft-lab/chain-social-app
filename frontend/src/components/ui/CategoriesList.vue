<template>
  <div v-if="showCategories" class="rounded-lg  mb-4">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-700">
      <div class="flex items-center">
        <div class="w-6 h-6 bg-teal-500 rounded-md flex items-center justify-center mr-3">
          <span class="text-white text-xs font-bold">CS</span>
        </div>
        <h3 class="text-white font-medium text-sm">KATEGORİLER</h3>
      </div>
    </div>

    <!-- Categories Content -->
    <div class="p-2">
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