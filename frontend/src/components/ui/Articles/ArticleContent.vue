<template>
  <div class="prose max-w-none mb-8 text-gray-900">
    <div v-if="content" v-html="content"></div>
    <div v-else class="text-center py-8 text-gray-500">
      <LoadingSpinner size="sm" :text="$t('common.ui.articleContentLoading')" />
    </div>
  </div>
</template>

<script setup>
import LoadingSpinner from '../../common/LoadingSpinner.vue'

defineProps({
  content: { type: String, default: null }
})
</script>

<style scoped>
/* Prose styling for article content */
.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4),
.prose :deep(h5),
.prose :deep(h6) {
  color: #1a1a1a !important;
  font-weight: 600 !important;
  margin: 1.5rem 0 0.75rem 0 !important;
  line-height: 1.3 !important;
}

.prose :deep(h1) {
  font-size: 2rem !important;
}

.prose :deep(h2) {
  font-size: 1.5rem !important;
}

.prose :deep(h3) {
  font-size: 1.25rem !important;
}

.prose :deep(h4) {
  font-size: 1.125rem !important;
}

.prose :deep(p) {
  color: #374151 !important;
  margin: 0.75rem 0 !important;
  line-height: 1.7 !important;
}

.prose :deep(strong),
.prose :deep(b) {
  color: #1a1a1a !important;
  font-weight: 600 !important;
}

.prose :deep(ul),
.prose :deep(ol) {
  color: #374151 !important;
}

.prose :deep(ul li),
.prose :deep(ol li) {
  color: #374151 !important;
  margin-bottom: 0.25rem !important;
}

.prose :deep(blockquote) {
  color: #6b7280 !important;
  border-left: 4px solid #d1d5db !important;
  padding-left: 1rem !important;
  font-style: italic !important;
  margin: 1.5rem 0 !important;
}

.prose :deep(a) {
  color: #2563eb !important;
  text-decoration: underline !important;
}

.prose :deep(a):hover {
  color: #1d4ed8 !important;
}

.prose :deep(img) {
  max-width: 100% !important;
  height: auto !important;
  border-radius: 0.5rem !important;
  margin: 1rem 0 !important;
}

.prose :deep(code) {
  background-color: #f3f4f6 !important;
  color: #1f2937 !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 0.25rem !important;
  font-size: 0.875rem !important;
}

.prose :deep(pre) {
  background-color: #1f2937 !important;
  color: #f9fafb !important;
  padding: 1rem !important;
  border-radius: 0.5rem !important;
  overflow-x: auto !important;
  margin: 1rem 0 !important;
}

.prose :deep(pre code) {
  background-color: transparent !important;
  color: inherit !important;
  padding: 0 !important;
}

/* Dark theme overrides */
.dark .prose :deep(h1),
.dark .prose :deep(h2),
.dark .prose :deep(h3),
.dark .prose :deep(h4),
.dark .prose :deep(h5),
.dark .prose :deep(h6) {
  color: #f9fafb !important;
}

.dark .prose :deep(p) {
  color: #d1d5db !important;
}

.dark .prose :deep(strong),
.dark .prose :deep(b) {
  color: #f9fafb !important;
}

.dark .prose :deep(ul),
.dark .prose :deep(ol) {
  color: #d1d5db !important;
}

.dark .prose :deep(ul li),
.dark .prose :deep(ol li) {
  color: #d1d5db !important;
}

.dark .prose :deep(blockquote) {
  color: #9ca3af !important;
  border-left-color: #4b5563 !important;
}

.dark .prose :deep(code) {
  background-color: #374151 !important;
  color: #f3f4f6 !important;
}
</style>