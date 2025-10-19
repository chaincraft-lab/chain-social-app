<template>
  <div class="rounded-lg mb-4">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-700">
      <div class="flex items-center">
        <button 
          @click="$emit('back')"
          class="w-6 h-6 bg-gray-600 rounded-md flex items-center justify-center mr-3 hover:bg-gray-500 transition-colors"
        >
          <Icon icon="heroicons:arrow-left" class="w-4 h-4 text-white" />
        </button>
        <h3 class="text-white font-medium text-sm">{{ (currentCategory && currentCategory.name) ? currentCategory.name.toUpperCase() : 'SUB KATEGORİLER' }}</h3>
      </div>
    </div>

    <!-- Sub-Categories Content -->
    <div class="p-2">
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-2">
        <SkeletonLoader v-for="i in 4" :key="i" type="list" />
      </div>

      <!-- Sub-Categories List -->
      <div v-else-if="subCategories && subCategories.length > 0">
        <SubCategoryItem
          v-for="subCategory in subCategories"
          :key="subCategory.id"
          :sub-category="subCategory"
          :parent-category="currentCategory"
        />
      </div>

      <!-- Empty State -->
      <EmptyState 
        v-else
        message="Alt kategori bulunmuyor"
      />
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import SubCategoryItem from './SubCategoryItem.vue'
import EmptyState from '../../common/EmptyState.vue'
import SkeletonLoader from '../../common/SkeletonLoader.vue'

defineProps({
  subCategories: { type: Array, required: true },
  currentCategory: { type: Object, default: null },
  isLoading: { type: Boolean, default: false }
})

defineEmits(['back'])
</script>