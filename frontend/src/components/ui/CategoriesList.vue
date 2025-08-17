<template>
  <div v-if="showCategories" class="bg-white rounded-lg shadow-sm mb-4">
    <!-- Header -->
    <SectionHeader title="Kategoriler">
      <template #icon>
        <svg class="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
        </svg>
      </template>
    </SectionHeader>

    <!-- Categories -->
    <div class="p-2">
      <CategoryItem
        v-for="category in categories"
        :key="category.id"
        :category="category"
      />
    </div>

    <!-- Empty State -->
    <EmptyState 
      v-if="!categories || categories.length === 0"
      message="Henüz kategori bulunmuyor"
    />
  </div>
</template>

<script setup>
import SectionHeader from '../common/SectionHeader.vue'
import CategoryItem from './Categories/CategoryItem.vue'
import EmptyState from '../common/EmptyState.vue'

defineProps({
  categories: { type: Array, required: true },
  showCategories: { type: Boolean, default: true }
})
</script>
