<template>
  <BaseWidget
    :title="t('common.widgets.market.title')"
    icon="heroicons:currency-dollar"
    :is-loading="isLoading"
    :loading-text="t('common.widgets.market.loading')"
    :error="error"
    @retry="fetchRates"
  >
    <!-- Market Content -->
    <div v-if="marketData" class="space-y-4">
      <!-- Major Currencies -->
      <div class="space-y-3">
        <h4 class="text-sm font-semibold theme-text-primary mb-2 flex items-center">
          <Icon icon="heroicons:currency-dollar" class="w-4 h-4 mr-1" />
          {{ t('common.widgets.market.majorCurrencies') }}
        </h4>
        
        <div class="space-y-2">
          <div 
            v-for="currency in majorCurrencies" 
            :key="currency.code"
            class="flex items-center justify-between p-2 theme-bg-secondary rounded-lg"
          >
            <div class="flex items-center">
              <span class="text-sm font-medium">{{ currency.code }}</span>
              <span class="text-xs theme-text-secondary ml-1">{{ currency.name }}</span>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold">₺{{ formatRate(marketData?.rates?.[currency.code]) }}</div>
              <div 
                :class="[
                  'text-xs font-medium',
                  currency.change > 0 ? 'text-green-600' : currency.change < 0 ? 'text-red-600' : 'theme-text-secondary'
                ]"
              >
                <Icon 
                  :icon="currency.change > 0 ? 'heroicons:arrow-up' : currency.change < 0 ? 'heroicons:arrow-down' : 'heroicons:minus'"
                  class="w-3 h-3 inline mr-1"
                />
                {{ Math.abs(currency.change).toFixed(2) }}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Defense Industry Commodities -->
      <div class="space-y-3 pt-3 border-t theme-border-primary">
        <h4 class="text-sm font-semibold theme-text-primary mb-2 flex items-center">
          <Icon icon="heroicons:wrench-screwdriver" class="w-4 h-4 mr-1" />
          {{ t('common.widgets.market.marketIndicators') }}
        </h4>
        
        <div class="grid grid-cols-2 gap-2">
          <div class="text-center p-2 theme-bg-secondary rounded-lg">
            <Icon icon="heroicons:bolt" class="w-4 h-4 mx-auto mb-1 text-yellow-500" />
            <p class="text-xs theme-text-secondary mb-1">{{ t('common.widgets.market.gold') }}</p>
            <p class="text-sm font-semibold">₺{{ formatRate(marketData?.rates?.XAU, 'gold') }}</p>
          </div>
          
          <div class="text-center p-2 theme-bg-secondary rounded-lg">
            <Icon icon="heroicons:cube" class="w-4 h-4 mx-auto mb-1 text-gray-400" />
            <p class="text-xs theme-text-secondary mb-1">{{ t('common.widgets.market.silver') }}</p>
            <p class="text-sm font-semibold">₺{{ formatRate(marketData?.rates?.XAG, 'silver') }}</p>
          </div>
          
          <div class="text-center p-2 theme-bg-secondary rounded-lg">
            <Icon icon="heroicons:fire" class="w-4 h-4 mx-auto mb-1 text-black" />
            <p class="text-xs theme-text-secondary mb-1">{{ t('common.widgets.market.oil') }}</p>
            <p class="text-sm font-semibold">₺{{ calculateOilPrice() }}</p>
          </div>
          
          <div class="text-center p-2 theme-bg-secondary rounded-lg">
            <Icon icon="heroicons:banknotes" class="w-4 h-4 mx-auto mb-1 text-green-600" />
            <p class="text-xs theme-text-secondary mb-1">BIST 100</p>
            <p class="text-sm font-semibold">{{ bistIndex.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Market Summary -->
      <div class="pt-3 border-t theme-border-primary">
        <div class="grid grid-cols-3 gap-2 text-center">
          <div>
            <p class="text-xs theme-text-secondary">{{ t('common.widgets.market.dollarIndex') }}</p>
            <p class="text-sm font-semibold">{{ dollarIndex }}</p>
          </div>
          <div>
            <p class="text-xs theme-text-secondary">{{ t('common.widgets.market.volatility') }}</p>
            <p class="text-sm font-semibold">{{ volatilityIndex }}</p>
          </div>
          <div>
            <p class="text-xs theme-text-secondary">{{ t('common.widgets.market.riskScore') }}</p>
            <p :class="['text-sm font-semibold', getRiskColor()]">{{ riskScore }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <template #actions v-if="marketData">
      <div class="flex justify-between items-center text-xs theme-text-secondary">
        <span>{{ t('common.widgets.market.lastUpdate') }}: {{ formatTime(lastUpdated) }}</span>
        <button 
          @click="fetchRates"
          class="flex items-center hover:theme-text-primary transition-colors"
          :disabled="isLoading"
        >
          <Icon icon="heroicons:arrow-path" class="w-3 h-3 mr-1" :class="{ 'animate-spin': isLoading }" />
          {{ t('common.widgets.market.refresh') }}
        </button>
      </div>
    </template>
  </BaseWidget>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import BaseWidget from './base/BaseWidget.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
const props = defineProps({
  baseCurrency: { type: String, default: 'TRY' },
  autoRefresh: { type: Boolean, default: true },
  refreshInterval: { type: Number, default: 300000 } // 5 minutes
})

// State
const marketData = ref(null)
const isLoading = ref(false)
const error = ref('')
const lastUpdated = ref(new Date())

// Market data for Turkish defense industry  
const currencyChanges = ref({
  USD: 0,
  EUR: 0,
  GBP: 0,
  JPY: 0
})

const majorCurrencies = computed(() => [
  { code: 'USD', name: t('common.widgets.market.currencies.usd'), change: currencyChanges.value.USD },
  { code: 'EUR', name: t('common.widgets.market.currencies.eur'), change: currencyChanges.value.EUR },
  { code: 'GBP', name: t('common.widgets.market.currencies.gbp'), change: currencyChanges.value.GBP },
  { code: 'JPY', name: t('common.widgets.market.currencies.jpy'), change: currencyChanges.value.JPY }
])

// Computed market indicators
const bistIndex = computed(() => {
  // Mock BIST 100 index - in real app, fetch from Turkish stock API
  return Math.floor(8500 + Math.random() * 1000)
})

const dollarIndex = computed(() => {
  // Mock DXY index
  return (103.50 + Math.random() * 2).toFixed(2)
})

const volatilityIndex = computed(() => {
  // Mock VIX-like index
  return (15.5 + Math.random() * 10).toFixed(1)
})

const riskScore = computed(() => {
  const vix = parseFloat(volatilityIndex.value)
  if (vix < 20) return t('common.widgets.market.risk.low')
  if (vix < 30) return t('common.widgets.market.risk.medium')
  return t('common.widgets.market.risk.high')
})

// Methods
const fetchRates = async () => {
  isLoading.value = true
  error.value = ''

  try {
    // Frankfurter API - ECB based, very reliable
    const response = await fetch(
      'https://api.frankfurter.app/latest?from=USD&to=TRY,EUR,GBP,JPY'
    )

    if (!response.ok) {
      throw new Error(t('common.widgets.market.errors.fetchFailed'))
    }

    const data = await response.json()
    console.log('Frankfurter API Response:', data) // Debug log
    
    // Check if data has the expected structure
    if (!data.rates) {
      throw new Error(t('common.widgets.market.errors.invalidFormat'))
    }

    // Get historical data for change calculation (yesterday)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const dateStr = yesterday.toISOString().split('T')[0]
    
    let historicalRates = {}
    try {
      const histResponse = await fetch(
        `https://api.frankfurter.app/${dateStr}?from=USD&to=TRY,EUR,GBP,JPY`
      )
      if (histResponse.ok) {
        const histData = await histResponse.json()
        historicalRates = histData.rates || {}
      }
    } catch (e) {
      console.warn('Historical data not available:', e)
    }

    // Convert USD-based rates to TRY-based rates for display
    const usdToTry = data.rates.TRY || 33.50 // Fallback if TRY not available
    const usdToEur = data.rates.EUR || 0.92
    const usdToGbp = data.rates.GBP || 0.79
    const usdToJpy = data.rates.JPY || 149
    
    marketData.value = {
      base: 'TRY',
      date: data.date,
      rates: {
        USD: usdToTry,                              // 1 USD = X TRY
        EUR: usdToTry / usdToEur,                   // 1 EUR = X TRY
        GBP: usdToTry / usdToGbp,                   // 1 GBP = X TRY  
        JPY: (usdToTry / usdToJpy) * 100,          // 100 JPY = X TRY
        // Mock precious metals (Frankfurter doesn't provide these)
        XAU: 2000 * usdToTry,                      // 1 oz Gold = X TRY (mock)
        XAG: 25 * usdToTry                         // 1 oz Silver = X TRY (mock)
      }
    }

    // Calculate real daily changes
    const currencies = ['USD', 'EUR', 'GBP', 'JPY']
    currencies.forEach(code => {
      if (historicalRates[code] && data.rates[code]) {
        const oldRate = historicalRates[code]
        const newRate = data.rates[code]
        currencyChanges.value[code] = ((newRate - oldRate) / oldRate) * 100
      } else {
        // Fallback to mock change
        currencyChanges.value[code] = (Math.random() - 0.5) * 3
      }
    })

    console.log('Processed market data:', marketData.value) // Debug log

    lastUpdated.value = new Date()
    error.value = ''
  } catch (err) {
    console.error('Market fetch error:', err)
    error.value = err.message || t('common.widgets.market.errors.general')
    marketData.value = null
  } finally {
    isLoading.value = false
  }
}

const formatRate = (rate, type = 'currency') => {
  if (!rate) return 'N/A'
  
  if (type === 'gold') {
    // Gold is per ounce, convert to reasonable TRY amount
    return (rate * 2000).toFixed(0)
  }
  
  if (type === 'silver') {
    // Silver is per ounce, convert to reasonable TRY amount  
    return (rate * 25).toFixed(0)
  }
  
  return rate.toFixed(2)
}

const calculateOilPrice = () => {
  // Mock oil price calculation (Brent crude * USD/TRY rate)
  if (!marketData.value?.rates?.USD) return 'N/A'
  const brentPrice = 85 + Math.random() * 10 // Mock Brent price $85-95
  const usdTryRate = marketData.value.rates.USD
  const oilInTRY = brentPrice * usdTryRate
  return oilInTRY.toFixed(0)
}

const formatTime = (date) => {
  return date.toLocaleTimeString('tr-TR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getRiskColor = () => {
  const risk = riskScore.value
  if (risk === t('common.widgets.market.risk.low')) return 'text-green-600'
  if (risk === t('common.widgets.market.risk.medium')) return 'text-yellow-600'
  return 'text-red-600'
}

// Auto refresh
let refreshTimer = null

const startAutoRefresh = () => {
  if (props.autoRefresh && props.refreshInterval > 0) {
    refreshTimer = setInterval(fetchRates, props.refreshInterval)
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
  fetchRates()
  startAutoRefresh()
})

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