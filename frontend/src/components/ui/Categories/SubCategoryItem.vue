<template>
  <router-link
    :to="{ name: 'subcategory', params: { categorySlug: parentCategory?.slug || '', subSlug: subCategory.slug } }"
    class="flex items-center justify-between py-3 px-4 my-1 rounded-lg text-gray-300 transition-all duration-200 hover:bg-gray-700/50 group"
  >
    <div class="flex items-center space-x-3">
      <!-- Sub-Category Icon -->
      <div 
        class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
        :style="{ backgroundColor: subCategory.color || getSubCategoryColor(subCategory.slug) }"
      >
        <!-- Use database icon if available, otherwise fallback -->
        <Icon 
          v-if="subCategory.icon && subCategory.icon.startsWith('heroicons:')" 
          :icon="subCategory.icon" 
          class="w-5 h-5" 
        />
        <span v-else>{{ getSubCategoryIcon(subCategory) }}</span>
      </div>
      
      <!-- Sub-Category Name -->
      <span class="text-sm font-medium group-hover:text-white transition-colors">
        {{ subCategory.name.toUpperCase() }}
      </span>
    </div>
    
    <!-- Article Count -->
    <span 
      v-if="subCategory.articleCount"
      class="text-xs text-gray-400 font-medium group-hover:text-gray-300 transition-colors"
    >
      {{ subCategory.articleCount }}
    </span>
  </router-link>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  subCategory: { type: Object, required: true },
  parentCategory: { type: Object, required: true }
})

// Fallback icon function for sub-categories
const getSubCategoryIcon = (subCategory) => {
  // Basic icon mapping for common sub-category types
  const iconMap = {
    'spot-trading': '💱',
    'futures': '📈',
    'options': '📊',
    'margin': '⚖️',
    'staking': '💰',
    'lending': '🏦',
    'yield-farming': '🌾',
    'liquidity-mining': '⛏️',
    'smart-contracts': '📜',
    'consensus': '🤝',
    'scalability': '📏',
    'security': '🔒',
    'art': '🎨',
    'gaming': '🎮',
    'music': '🎵',
    'sports': '⚽',
    'collectibles': '🃏',
    'utility': '🔧',
    'pfp': '👤',
    'metaverse': '🌐'
  }
  
  return iconMap[subCategory.slug] || subCategory.name.charAt(0).toUpperCase()
}

// Fallback color function for sub-categories
const getSubCategoryColor = (slug) => {
  // Generate consistent color based on slug hash but with different base hue
  const hash = slug.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  const hue = (Math.abs(hash) % 360 + 180) % 360 // Offset hue for variation
  return `hsl(${hue}, 60%, 45%)`
}
</script>