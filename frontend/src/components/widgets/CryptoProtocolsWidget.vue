<template>
  <BaseWidget
    :title="$t('common.widgets.cryptoMarket.title')"
    icon="heroicons:chart-bar"
    :is-loading="isLoading"
    :loading-text="$t('common.widgets.cryptoMarket.loading')"
    :error="error"
    @retry="fetchCryptoData"
  >
    <!-- Crypto Data Content -->
    <div v-if="cryptoData && cryptoData.length > 0" class="space-y-3">
      <div 
        v-for="crypto in cryptoData" 
        :key="crypto.id"
        class="flex items-center justify-between p-3 theme-bg-secondary rounded-lg hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-center gap-3 flex-1">
          <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Icon 
              :icon="crypto.icon || 'heroicons:currency-dollar'" 
              class="w-4 h-4 text-white"
            />
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-sm theme-text-primary">{{ crypto.symbol }}</h4>
            <p class="text-xs theme-text-secondary">
              {{ crypto.name }}
            </p>
          </div>
        </div>
        
        <div class="text-right">
          <div class="flex items-center gap-2">
            <span class="font-bold text-sm theme-text-primary">
              {{ formatPrice(crypto.price) }}
            </span>
          </div>
          <div class="flex items-center gap-1 text-xs">
            <Icon 
              :icon="crypto.change >= 0 ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'"
              :class="crypto.change >= 0 ? 'text-green-500' : 'text-red-500'"
              class="w-3 h-3"
            />
            <span :class="crypto.change >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ formatChange(crypto.change) }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading && !error" class="text-center py-8">
      <Icon icon="heroicons:chart-bar" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p class="theme-text-secondary text-sm">{{ $t('common.widgets.cryptoMarket.emptyState') }}</p>
    </div>
  </BaseWidget>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import BaseWidget from './base/BaseWidget.vue'

const router = useRouter()

// Reactive data
const isLoading = ref(false)
const error = ref(null)
const cryptoData = ref([])

// Mock crypto data for display
const mockCryptoData = [
  {
    id: 1,
    name: 'Arbitrum',
    symbol: 'ARB',
    price: 1.25,
    change: 5.67,
    icon: 'cryptocurrency:arb'
  },
  {
    id: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    price: 2341.89,
    change: -2.34,
    icon: 'cryptocurrency:eth'
  },
  {
    id: 3,
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 43256.78,
    change: 1.23,
    icon: 'cryptocurrency:btc'
  },
  {
    id: 4,
    name: 'Polygon',
    symbol: 'MATIC',
    price: 0.89,
    change: 4.12,
    icon: 'cryptocurrency:matic'
  }
]

// Methods
const fetchCryptoData = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In real implementation, this would be an API call to get crypto prices
    cryptoData.value = mockCryptoData
    
  } catch (err) {
    console.error('Error fetching crypto data:', err)
    error.value = 'Failed to load market data'
  } finally {
    isLoading.value = false
  }
}

const formatPrice = (price) => {
  if (!price) return '-'
  if (price < 1) {
    return `$${price.toFixed(4)}`
  }
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatChange = (change) => {
  if (!change) return '0.00'
  return Math.abs(change).toFixed(2)
}

// Lifecycle
onMounted(() => {
  fetchCryptoData()
})
</script>

<style scoped>
/* Custom styles if needed */
.protocol-item {
  @apply transition-all duration-200 hover:scale-[1.02];
}
</style>