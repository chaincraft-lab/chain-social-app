<template>
  <BaseWidget
    title="⚡ Top Blockchain Protokolleri"
    icon="heroicons:currency-dollar"
    :is-loading="isLoading"
    loading-text="Protocol verileri alınıyor..."
    :error="error"
    @retry="fetchProtocols"
  >
    <!-- Protocols Content -->
    <div v-if="protocolsData && protocolsData.length > 0" class="space-y-3">
      <div 
        v-for="protocol in protocolsData" 
        :key="protocol.id"
        class="flex items-center justify-between p-3 theme-bg-secondary rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
        @click="navigateToProtocol(protocol.slug)"
      >
        <div class="flex items-center gap-3 flex-1">
          <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Icon 
              :icon="protocol.icon || 'heroicons:cube'" 
              class="w-4 h-4 text-white"
            />
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-sm theme-text-primary">{{ protocol.name }}</h4>
            <p class="text-xs theme-text-secondary">
              {{ protocol.tokenSymbol }} • {{ protocol.blockchain }}
            </p>
          </div>
        </div>
        
        <div class="text-right">
          <div class="flex items-center gap-2">
            <span class="font-bold text-sm theme-text-primary">
              {{ formatPrice(protocol.price) }}
            </span>
          </div>
          <div class="flex items-center gap-1 text-xs">
            <Icon 
              :icon="protocol.change >= 0 ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'"
              :class="protocol.change >= 0 ? 'text-green-500' : 'text-red-500'"
              class="w-3 h-3"
            />
            <span :class="protocol.change >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ formatChange(protocol.change) }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading && !error" class="text-center py-8">
      <Icon icon="heroicons:chart-bar" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p class="theme-text-secondary text-sm">Henüz protocol verisi bulunmuyor</p>
    </div>

    <!-- Footer Link -->
    <template #footer>
      <router-link 
        to="/protocols" 
        class="block w-full text-center py-2 text-sm font-medium theme-text-primary hover:theme-text-secondary transition-colors"
      >
        Tüm Protokolleri Gör →
      </router-link>
    </template>
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
const protocolsData = ref([])

// Mock data for development
const mockProtocols = [
  {
    id: 1,
    name: 'Arbitrum',
    slug: 'arbitrum',
    tokenSymbol: 'ARB',
    blockchain: 'Ethereum',
    price: 1.25,
    change: 5.67,
    tvl: 2100000000,
    icon: 'cryptocurrency:arb'
  },
  {
    id: 2,
    name: 'Optimism',
    slug: 'optimism', 
    tokenSymbol: 'OP',
    blockchain: 'Ethereum',
    price: 2.34,
    change: -2.31,
    tvl: 950000000,
    icon: 'cryptocurrency:op'
  },
  {
    id: 3,
    name: 'Polygon',
    slug: 'polygon',
    tokenSymbol: 'MATIC',
    blockchain: 'Ethereum',
    price: 0.87,
    change: 3.45,
    tvl: 850000000,
    icon: 'cryptocurrency:matic'
  },
  {
    id: 4,
    name: 'Avalanche',
    slug: 'avalanche',
    tokenSymbol: 'AVAX',
    blockchain: 'Avalanche',
    price: 28.45,
    change: 1.23,
    tvl: 1200000000,
    icon: 'cryptocurrency:avax'
  },
  {
    id: 5,
    name: 'Solana',
    slug: 'solana',
    tokenSymbol: 'SOL',
    blockchain: 'Solana',
    price: 145.67,
    change: -4.56,
    tvl: 1800000000,
    icon: 'cryptocurrency:sol'
  }
]

// Methods
const fetchProtocols = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In real implementation, this would be:
    // const response = await CategoryService.getActiveCategories()
    // protocolsData.value = response.data.map(protocol => ({
    //   ...protocol,
    //   price: Math.random() * 100,
    //   change: (Math.random() - 0.5) * 20
    // }))
    
    protocolsData.value = mockProtocols
    
  } catch (err) {
    console.error('Error fetching protocols:', err)
    error.value = 'Protocol verileri alınamadı'
  } finally {
    isLoading.value = false
  }
}

const navigateToProtocol = (slug) => {
  router.push(`/protocol/${slug}`)
}

const formatPrice = (price) => {
  if (!price) return '-'
  if (price < 1) {
    return `$${price.toFixed(4)}`
  }
  return `$${price.toFixed(2)}`
}

const formatChange = (change) => {
  if (!change) return '0.00'
  return Math.abs(change).toFixed(2)
}

// Lifecycle
onMounted(() => {
  fetchProtocols()
})
</script>

<style scoped>
/* Custom styles if needed */
.protocol-item {
  @apply transition-all duration-200 hover:scale-[1.02];
}
</style>