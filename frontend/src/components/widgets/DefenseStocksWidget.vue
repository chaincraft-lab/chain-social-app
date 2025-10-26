<template>
  <BaseWidget
    title="🛡️ Savunma Sanayi Hisseleri"
    icon="heroicons:shield-check"
    :is-loading="isLoading"
    loading-text="Hisse verileri alınıyor..."
    :error="error"
    @retry="fetchStocks"
  >
    <!-- Stocks Content -->
    <div v-if="stocksData && stocksData.length > 0" class="space-y-3">
      <div 
        v-for="stock in stocksData" 
        :key="stock.symbol"
        class="flex items-center justify-between p-3 theme-bg-secondary rounded-lg hover:shadow-md transition-all duration-200"
      >
        <div class="flex-1">
          <h4 class="font-semibold text-sm theme-text-primary">{{ stock.name }}</h4>
          <p class="text-xs theme-text-secondary">{{ stock.symbol }}</p>
        </div>
        
        <div class="text-right">
          <div class="flex items-center gap-2">
            <span class="font-bold text-sm theme-text-primary">{{ stock.price.toFixed(2) }} ₺</span>
          </div>
          <div class="flex items-center gap-1 text-xs">
            <Icon 
              :icon="stock.change >= 0 ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'"
              :class="stock.change >= 0 ? 'text-green-500' : 'text-red-500'"
              class="w-3 h-3"
            />
            <span :class="stock.change >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ stock.change >= 0 ? '+' : '' }}{{ stock.changePercent.toFixed(2) }}%
            </span>
          </div>
        </div>
      </div>
      
      <!-- Market Summary -->
      <div class="pt-3 border-t theme-border-primary">
        <div class="grid grid-cols-2 gap-3 text-center">
          <div class="p-2 theme-bg-secondary rounded">
            <Icon icon="heroicons:arrow-trending-up" class="w-4 h-4 mx-auto mb-1 text-green-500" />
            <p class="text-xs theme-text-secondary">Yükselenler</p>
            <p class="font-medium text-green-500">{{ gainersCount }}</p>
          </div>
          <div class="p-2 theme-bg-secondary rounded">
            <Icon icon="heroicons:arrow-trending-down" class="w-4 h-4 mx-auto mb-1 text-red-500" />
            <p class="text-xs theme-text-secondary">Düşenler</p>
            <p class="font-medium text-red-500">{{ losersCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <template #actions v-if="stocksData">
      <div class="flex justify-between items-center text-xs theme-text-secondary">
        <span>Son güncelleme: {{ formatTime(lastUpdated) }}</span>
        <button 
          @click="fetchStocks"
          class="flex items-center hover:theme-text-primary transition-colors"
          :disabled="isLoading"
        >
          <Icon icon="heroicons:arrow-path" class="w-3 h-3 mr-1" :class="{ 'animate-spin': isLoading }" />
          {{ $t('common.ui.refresh') }}
        </button>
      </div>
    </template>
  </BaseWidget>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import BaseWidget from './base/BaseWidget.vue'

// Props
const props = defineProps({
  autoRefresh: { type: Boolean, default: true },
  refreshInterval: { type: Number, default: 300000 } // 5 minutes
})

// State
const stocksData = ref([])
const isLoading = ref(false)
const error = ref('')
const lastUpdated = ref(new Date())

// {{ $t('common.comments.turkishDefenseCompanies') }}
const defenseCompanies = [
  { symbol: 'ASELS.IS', name: 'ASELSAN', bist: 'ASELS' },
  { symbol: 'OTKAR.IS', name: 'Otokar', bist: 'OTKAR' },
  { symbol: 'KATMR.IS', name: 'Katmerciler', bist: 'KATMR' },
  { symbol: 'PAPIL.IS', name: 'Papilon', bist: 'PAPIL' },
  { symbol: 'SDTTR.IS', name: 'SDT Uzay ve Savunma', bist: 'SDTTR' },
  { symbol: 'ALTNY.IS', name: 'Altınay Savunma', bist: 'ALTNY' }
]

// Computed
const gainersCount = computed(() => {
  return stocksData.value.filter(stock => stock.change > 0).length
})

const losersCount = computed(() => {
  return stocksData.value.filter(stock => stock.change < 0).length
})

// Methods
const fetchStocks = async () => {
  isLoading.value = true
  error.value = ''

  try {
    // Mock data - gerçek API entegrasyonu için Alpha Vantage, Yahoo Finance veya Investing.com API kullanılabilir
    const mockStocks = defenseCompanies.map(company => {
      const basePrice = 50 + Math.random() * 200
      const change = (Math.random() - 0.5) * 10
      const changePercent = (change / basePrice) * 100
      
      return {
        symbol: company.bist,
        name: company.name,
        price: basePrice,
        change: change,
        changePercent: changePercent,
        volume: Math.floor(Math.random() * 1000000),
        lastPrice: basePrice - change
      }
    })
    
    // Simulated API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    stocksData.value = mockStocks
    lastUpdated.value = new Date()
    error.value = ''
    
  } catch (err) {
    console.error('Error fetching stocks:', err)
    error.value = err.message || 'Hisse verileri alınamadı'
    stocksData.value = []
  } finally {
    isLoading.value = false
  }
}

/* 
// Gerçek API implementasyonu için örnek (Yahoo Finance API)
const fetchStocksFromAPI = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const symbols = defenseCompanies.map(c => c.symbol).join(',')
    
    // Yahoo Finance API example
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbols}?interval=1d&range=1d`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Hisse verileri alınamadı')
    }

    const data = await response.json()
    
    // Process the data
    const processedStocks = data.chart.result.map((result, index) => {
      const meta = result.meta
      const quote = result.indicators.quote[0]
      const company = defenseCompanies[index]
      
      return {
        symbol: company.bist,
        name: company.name,
        price: meta.regularMarketPrice,
        change: meta.regularMarketPrice - meta.previousClose,
        changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
        volume: meta.regularMarketVolume
      }
    })
    
    stocksData.value = processedStocks
    lastUpdated.value = new Date()
    
  } catch (err) {
    console.error('Error fetching stocks:', err)
    error.value = err.message || 'Hisse verileri alınamadı'
    stocksData.value = []
  } finally {
    isLoading.value = false
  }
}
*/

const formatTime = (date) => {
  return date.toLocaleTimeString('tr-TR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Auto refresh
let refreshTimer = null

const startAutoRefresh = () => {
  if (props.autoRefresh && props.refreshInterval > 0) {
    refreshTimer = setInterval(fetchStocks, props.refreshInterval)
  }
}

const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// Lifecycle
onMounted(() => {
  fetchStocks()
  startAutoRefresh()
})

// Cleanup
onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>