<template>
  <div v-if="showPopular" class="theme-card rounded-lg shadow-sm mb-4">
    <!-- Header -->
    <SectionHeader title="Popüler Haberler">
      <template #icon>
        <Icon icon="heroicons:chart-bar-square" class="w-6 h-6 mr-2 text-primary" />
      </template>
    </SectionHeader>

    <div class="p-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="divide-y divide-gray-200">
        <SkeletonLoader v-for="i in 5" :key="i" type="popular-news" />
      </div>

      <!-- News List -->
      <ul v-else-if="popularNews && popularNews.length > 0" class="divide-y divide-gray-200">
        <NewsItem
          v-for="(news, index) in popularNews"
          :key="news.id"
          :news="news"
          :index="index"
          :title-size="titleSize"
          :max-title-length="maxTitleLength"
        />
      </ul>

      <!-- Empty State -->
      <EmptyState v-else message="Henüz popüler haber bulunmuyor">
        <template #icon>
          <Icon icon="heroicons:document-text" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
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
  showPopular: { type: Boolean, default: true },
  titleSize: { 
    type: String, 
    default: 'sm',
    validator: value => ['xs', 'sm', 'base', 'lg'].includes(value)
  },
  maxTitleLength: {
    type: Number,
    default: 60
  }
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
