<template>
  <div class="rounded-xs p-4 shadow">
    <!-- Back Button -->
    <button 
      @click="goBack"
      class="flex items-center text-gray-400 hover:text-white transition-colors mb-4 text-sm"
    >
      <Icon icon="heroicons:arrow-left" class="w-4 h-4 mr-2" />
      {{ $t('pages.category.backToHome') }}
    </button>

    <!-- Category Icon & Header -->
    <div class="text-center mb-4">
      <div 
        class="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold"
        :style="{ backgroundColor: currentCategory?.color || '#6B7280' }"
      >
        <Icon 
          v-if="currentCategory?.icon" 
          :icon="currentCategory.icon" 
          class="w-8 h-8" 
        />
        <span v-else>{{ currentCategory?.name?.charAt(0) || 'K' }}</span>
      </div>
      
      <h1 class="text-xl font-bold theme-text-primary mb-2">
        {{ currentCategory?.name || $t('pages.category.defaultTitle') }}
      </h1>
      
      <p class="text-xs theme-text-secondary leading-relaxed">
        {{ currentCategory?.description?.substring(0, 80) + '...' || $t('pages.category.defaultDescription') }}
      </p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="text-center p-2 theme-bg-primary rounded-md">
        <div class="text-base font-bold theme-text-primary">
          {{ currentCategory?.articleCount || '0' }}
        </div>
        <div class="text-xs theme-text-secondary">{{ $t('pages.category.stats.news') }}</div>
      </div>
      
      <div class="text-center p-2 theme-bg-primary rounded-md">
        <div class="text-base font-bold theme-text-primary">
          {{ formatFollowerCount(currentCategory?.followerCount) }}
        </div>
        <div class="text-xs theme-text-secondary">{{ $t('pages.category.stats.followers') }}</div>
      </div>
    </div>

    <!-- Follow Button -->
    <button 
      @click="toggleFollow"
      class="w-full py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
      :class="isFollowing 
        ? 'bg-green-600 hover:bg-green-700 text-white' 
        : 'bg-blue-600 hover:bg-blue-700 text-white'"
    >
      <Icon 
        :icon="isFollowing ? 'heroicons:check' : 'heroicons:plus'" 
        class="w-4 h-4" 
      />
      <span>{{ isFollowing ? $t('pages.category.following') : $t('pages.category.follow') }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { Icon } from '@iconify/vue'

const router = useRouter()
const route = useRoute()
const store = useStore()

const isFollowing = ref(false)

const currentCategory = computed(() => {
  const categories = store.state.categories.categories || []
  const categorySlug = route.params.slug
  return categories.find((c) => c && c.slug === categorySlug) || null
})

const goBack = () => {
  router.push({ name: 'home' })
}

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
  // Here you would typically make an API call to follow/unfollow
}

const formatFollowerCount = (count) => {
  if (!count) return '10' // Default value
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

</script>

<style scoped>
.category-info-card {
  background: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(75, 85, 99, 0.3);
}
</style>