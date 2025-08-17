<template>
  <div v-if="showPopular" class="bg-white rounded-lg shadow-sm mb-6">
    <!-- Header -->
    <SectionHeader title="Popüler Haberler">
      <template #icon>
        <svg class="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>
      </template>
    </SectionHeader>

    <div class="p-3">
      <!-- Loading State -->
      <SkeletonLoader v-if="isLoading" :count="5" type="news" />

      <!-- News List -->
      <ul v-else-if="popularNews && popularNews.length > 0" class="divide-y divide-gray-200">
        <NewsItem
          v-for="(news, index) in popularNews"
          :key="news.id"
          :news="news"
          :index="index"
        />
      </ul>

      <!-- Empty State -->
      <EmptyState v-else message="Henüz popüler haber bulunmuyor">
        <template #icon>
          <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </template>
      </EmptyState>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from 'vuex'
import SectionHeader from '../common/SectionHeader.vue'
import SkeletonLoader from '../common/SkeletonLoader.vue'
import NewsItem from './News/NewsItem.vue'
import EmptyState from '../common/EmptyState.vue'

const props = defineProps({
  showPopular: { type: Boolean, default: true }
})

const store = useStore()
const popularNews = computed(() => store.state.news.popularNews || [])
const isLoading = computed(() => store.getters['news/isLoading']('popular'))

onMounted(() => {
  if (props.showPopular && (!popularNews.value || popularNews.value.length === 0)) {
    store.dispatch('news/fetchPopularNews', 10)
  }
})
</script>
