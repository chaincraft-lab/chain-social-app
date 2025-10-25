<template>
  <router-link
    :to="{ name: 'category', params: { slug: category.slug } }"
    class="flex items-center justify-between py-3 px-4 my-1 rounded-lg text-gray-300 transition-all duration-200 hover:bg-gray-700/50 group"
  >
    <div class="flex items-center space-x-3">
      <!-- Category Icon -->
      <div 
        class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
        :style="{ backgroundColor: category.color || getCategoryColor(category.slug) }"
      >
        <!-- Use database icon if available, otherwise fallback -->
        <Icon 
          v-if="category.icon && category.icon.startsWith('cryptocurrency:')" 
          :icon="category.icon" 
          class="w-5 h-5" 
        />
        <span v-else>{{ getCategoryIcon(category) }}</span>
      </div>
      
      <!-- Category Name -->
      <span class="text-sm font-medium group-hover:text-white transition-colors">
        {{ category.name.toUpperCase() }}
      </span>
    </div>
    
    <!-- Article Count -->
    <span 
      v-if="category.articleCount"
      class="text-xs text-gray-400 font-medium group-hover:text-gray-300 transition-colors"
    >
      {{ category.articleCount }}
    </span>
  </router-link>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  category: { type: Object, required: true }
})

// Fallback icon function - use when database doesn't have icon or for non-crypto categories
const getCategoryIcon = (category) => {
  // If database has tokenSymbol, use it as icon
  if (category.tokenSymbol) {
    return category.tokenSymbol
  }
  
  // Arbitrum ecosystem category mapping
  const iconMap = {
    'defi': '🏦',
    'gaming': '🎮',
    'nft': '🎨',
    'infrastructure': '⚙️',
    'grants': '💰',
    'finans': '📈'
  }
  
  return iconMap[category.slug] || category.name.charAt(0).toUpperCase()
}

// Fallback color function - use when database doesn't have color
const getCategoryColor = (slug) => {
  // Generate consistent color based on slug hash
  const hash = slug.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 70%, 50%)`
}
</script>
