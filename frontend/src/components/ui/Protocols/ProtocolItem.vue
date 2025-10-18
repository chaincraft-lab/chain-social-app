<template>
  <router-link
    :to="{ name: 'protocol', params: { slug: protocol.slug } }"
    class="flex items-center justify-between p-3 mx-2 my-1 rounded-lg border transition-all duration-200 hover:shadow-md hover:border-blue-200 group"
  >
    <div class="flex items-center gap-3 flex-1">
      <!-- Protocol Icon/Logo -->
      <div 
        class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
        :style="{ backgroundColor: protocol.color || '#3B82F6' }"
      >
        <Icon 
          v-if="protocol.icon" 
          :icon="protocol.icon" 
          class="w-5 h-5"
        />
        <span v-else>
          {{ protocol.name.charAt(0).toUpperCase() }}
        </span>
      </div>

      <!-- Protocol Info -->
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <span class="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {{ protocol.name }}
          </span>
          <span 
            v-if="protocol.tokenSymbol"
            class="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded"
          >
            {{ protocol.tokenSymbol }}
          </span>
        </div>
        
        <div class="flex items-center gap-2 mt-1">
          <span 
            v-if="protocol.blockchain"
            class="text-sm text-gray-500"
          >
            {{ protocol.blockchain }}
          </span>
          <span 
            v-if="protocol.website"
            class="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            🔗 {{ extractDomain(protocol.website) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Article Count & Stats -->
    <div class="text-right">
      <span 
        v-if="protocol.articleCount"
        class="inline-flex items-center px-2.5 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded-full transition-all duration-200 group-hover:bg-blue-200"
      >
        {{ protocol.articleCount }} haber
      </span>
      
      <!-- Protocol Metrics (if available) -->
      <div v-if="showMetrics && (protocol.price || protocol.tvl)" class="mt-1 text-xs text-gray-500">
        <div v-if="protocol.price" class="flex items-center gap-1">
          <span>${{ formatPrice(protocol.price) }}</span>
          <span 
            v-if="protocol.priceChange24h"
            :class="protocol.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'"
          >
            {{ protocol.priceChange24h > 0 ? '+' : '' }}{{ protocol.priceChange24h.toFixed(2) }}%
          </span>
        </div>
        <div v-if="protocol.tvl" class="text-gray-400">
          TVL: ${{ formatLargeNumber(protocol.tvl) }}
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  protocol: { type: Object, required: true },
  showMetrics: { type: Boolean, default: false }
})

// Helper functions
const extractDomain = (url) => {
  if (!url) return ''
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

const formatPrice = (price) => {
  if (!price) return '0.00'
  if (price < 1) return price.toFixed(4)
  return price.toFixed(2)
}

const formatLargeNumber = (num) => {
  if (!num) return '0'
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toString()
}
</script>

<style scoped>
/* Additional hover effects */
.router-link:hover .protocol-icon {
  transform: scale(1.05);
}
</style>