<template>
  <div v-if="showCategories" class="theme-card rounded-lg shadow-sm mb-4">
    <!-- Header -->
    <SectionHeader title="Kategoriler">
      <template #icon>
        <Icon icon="heroicons:folder" class="w-5 h-5 mr-2 text-primary" />
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
