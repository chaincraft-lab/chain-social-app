<template>
  <BaseWidget
    title="🌍 2025 Askeri Güç Sıralaması"
    icon="heroicons:shield-check"
    :is-loading="isLoading"
    loading-text="Askeri güç verileri alınıyor..."
    :error="error"
    @retry="fetchMilitaryData"
  >
    <!-- Military Ranking Content -->
    <div v-if="militaryData && militaryData.length > 0" class="space-y-2">
      <div 
        v-for="(country, index) in militaryData" 
        :key="country.country"
        class="flex items-center justify-between p-3 theme-bg-secondary rounded-lg hover:shadow-md transition-all duration-200"
        :class="{ 'border-l-4 border-red-500': country.country === 'Türkiye' }"
      >
        <div class="flex items-center gap-3 flex-1">
          <div class="flex items-center justify-center w-8 h-6 text-xs font-bold theme-text-primary">
            {{ country.rank }}
          </div>
          
          <div class="flex items-center gap-2 flex-1">
            <div class="w-6 h-4 rounded overflow-hidden flex-shrink-0">
              <img 
                :src="country.flag" 
                :alt="country.country"
                class="w-full h-full object-cover"
                @error="handleFlagError"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-sm theme-text-primary truncate">{{ country.country }}</h4>
              <p class="text-xs theme-text-secondary">PwrIndx: {{ country.powerIndex }}</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-1">
          <Icon 
            v-if="country.trend === 'up'"
            icon="heroicons:arrow-trending-up"
            class="w-4 h-4 text-green-500"
          />
          <Icon 
            v-else-if="country.trend === 'down'"
            icon="heroicons:arrow-trending-down"
            class="w-4 h-4 text-red-500"
          />
          <Icon 
            v-else
            icon="heroicons:minus"
            class="w-4 h-4 theme-text-secondary"
          />
        </div>
      </div>
      
      <!-- Turkey Highlight -->
      <div v-if="turkeyRanking" class="mt-4 p-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg border border-red-200 dark:border-red-700">
        <div class="flex items-center gap-2 mb-2">
          <Icon icon="heroicons:flag" class="w-4 h-4 text-red-600" />
          <span class="font-semibold text-sm text-red-700 dark:text-red-300">Türkiye Askeri Gücü</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span class="theme-text-secondary">Dünya Sıralaması:</span>
            <span class="font-bold text-red-600 ml-1">#{{ turkeyRanking.rank }}</span>
          </div>
          <div>
            <span class="theme-text-secondary">Güç İndeksi:</span>
            <span class="font-bold theme-text-primary ml-1">{{ turkeyRanking.powerIndex }}</span>
          </div>
        </div>
      </div>
      
      <!-- Summary Stats -->
      <div class="pt-3 border-t theme-border-primary">
        <div class="grid grid-cols-3 gap-2 text-center text-xs">
          <div class="p-2 theme-bg-secondary rounded">
            <Icon icon="heroicons:arrow-trending-up" class="w-3 h-3 mx-auto mb-1 text-green-500" />
            <p class="theme-text-secondary">Yükselenler</p>
            <p class="font-medium text-green-500">{{ trendingUp }}</p>
          </div>
          <div class="p-2 theme-bg-secondary rounded">
            <Icon icon="heroicons:arrow-trending-down" class="w-3 h-3 mx-auto mb-1 text-red-500" />
            <p class="theme-text-secondary">Düşenler</p>
            <p class="font-medium text-red-500">{{ trendingDown }}</p>
          </div>
          <div class="p-2 theme-bg-secondary rounded">
            <Icon icon="heroicons:minus" class="w-3 h-3 mx-auto mb-1 theme-text-secondary" />
            <p class="theme-text-secondary">Sabit</p>
            <p class="font-medium theme-text-primary">{{ stable }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <template #actions v-if="militaryData">
      <div class="flex justify-between items-center text-xs theme-text-secondary">
        <span>Kaynak: Global Firepower 2025</span>
        <button 
          @click="fetchMilitaryData"
          class="flex items-center hover:theme-text-primary transition-colors"
          :disabled="isLoading"
        >
          <Icon icon="heroicons:arrow-path" class="w-3 h-3 mr-1" :class="{ 'animate-spin': isLoading }" />
          Yenile
        </button>
      </div>
    </template>
  </BaseWidget>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import BaseWidget from './base/BaseWidget.vue'

// Props
const props = defineProps({
  showTop: { type: Number, default: 10 },
  highlightCountry: { type: String, default: 'Türkiye' }
})

// State
const militaryData = ref([])
const isLoading = ref(false)
const error = ref('')

// Mock data based on the provided image
const mockMilitaryData = [
  {
    rank: 1,
    country: 'United States',
    powerIndex: '0.0744',
    flag: 'https://flagcdn.com/w20/us.png',
    trend: 'stable'
  },
  {
    rank: 2,
    country: 'Russia',
    powerIndex: '0.0788',
    flag: 'https://flagcdn.com/w20/ru.png',
    trend: 'stable'
  },
  {
    rank: 3,
    country: 'China',
    powerIndex: '0.0788',
    flag: 'https://flagcdn.com/w20/cn.png',
    trend: 'stable'
  },
  {
    rank: 4,
    country: 'India',
    powerIndex: '0.1184',
    flag: 'https://flagcdn.com/w20/in.png',
    trend: 'stable'
  },
  {
    rank: 5,
    country: 'South Korea',
    powerIndex: '0.1656',
    flag: 'https://flagcdn.com/w20/kr.png',
    trend: 'stable'
  },
  {
    rank: 6,
    country: 'United Kingdom',
    powerIndex: '0.1785',
    flag: 'https://flagcdn.com/w20/gb.png',
    trend: 'stable'
  },
  {
    rank: 7,
    country: 'France',
    powerIndex: '0.1878',
    flag: 'https://flagcdn.com/w20/fr.png',
    trend: 'up'
  },
  {
    rank: 8,
    country: 'Japan',
    powerIndex: '0.1839',
    flag: 'https://flagcdn.com/w20/jp.png',
    trend: 'down'
  },
  {
    rank: 9,
    country: 'Türkiye',
    powerIndex: '0.1902',
    flag: 'https://flagcdn.com/w20/tr.png',
    trend: 'stable'
  },
  {
    rank: 10,
    country: 'Italy',
    powerIndex: '0.2164',
    flag: 'https://flagcdn.com/w20/it.png',
    trend: 'stable'
  },
  {
    rank: 11,
    country: 'Brazil',
    powerIndex: '0.2269',
    flag: 'https://flagcdn.com/w20/br.png',
    trend: 'down'
  },
  {
    rank: 12,
    country: 'Germany',
    powerIndex: '0.2847',
    flag: 'https://flagcdn.com/w20/de.png',
    trend: 'up'
  },
  {
    rank: 13,
    country: 'Pakistan',
    powerIndex: '0.3441',
    flag: 'https://flagcdn.com/w20/pk.png',
    trend: 'stable'
  },
  {
    rank: 14,
    country: 'Australia',
    powerIndex: '0.3626',
    flag: 'https://flagcdn.com/w20/au.png',
    trend: 'down'
  },
  {
    rank: 15,
    country: 'Canada',
    powerIndex: '0.3956',
    flag: 'https://flagcdn.com/w20/ca.png',
    trend: 'up'
  }
]

// Computed
const turkeyRanking = computed(() => {
  return militaryData.value.find(country => country.country === props.highlightCountry)
})

const trendingUp = computed(() => {
  return militaryData.value.filter(country => country.trend === 'up').length
})

const trendingDown = computed(() => {
  return militaryData.value.filter(country => country.trend === 'down').length
})

const stable = computed(() => {
  return militaryData.value.filter(country => country.trend === 'stable').length
})

// Methods
const fetchMilitaryData = async () => {
  isLoading.value = true
  error.value = ''

  try {
    // Simulated API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Use mock data - show only top N countries
    militaryData.value = mockMilitaryData.slice(0, props.showTop)
    error.value = ''
    
  } catch (err) {
    console.error('Error fetching military data:', err)
    error.value = err.message || 'Askeri güç verileri alınamadı'
    militaryData.value = []
  } finally {
    isLoading.value = false
  }
}

/*
// Real API implementation example (if available)
const fetchMilitaryDataFromAPI = async () => {
  isLoading.value = true
  error.value = ''

  try {
    // Example API call - replace with actual endpoint
    const response = await fetch('https://api.globalfirepower.com/v1/rankings/2025', {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Askeri güç verileri alınamadı')
    }

    const data = await response.json()
    
    // Process the data
    militaryData.value = data.rankings.slice(0, props.showTop).map(item => ({
      rank: item.rank,
      country: item.country_name,
      powerIndex: item.power_index,
      flag: `https://flagcdn.com/w20/${item.country_code.toLowerCase()}.png`,
      trend: item.trend || 'stable'
    }))
    
  } catch (err) {
    console.error('Error fetching military data:', err)
    error.value = err.message || 'Askeri güç verileri alınamadı'
    militaryData.value = []
  } finally {
    isLoading.value = false
  }
}
*/

const handleFlagError = (event) => {
  // Fallback flag image
  event.target.src = 'https://via.placeholder.com/24x16/f0f0f0/666666?text=?'
}

// Lifecycle
onMounted(() => {
  fetchMilitaryData()
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