<template>
  <BaseWidget
    title="Hava Durumu"
    icon="heroicons:sun"
    :is-loading="isLoading"
    loading-text="Hava durumu alınıyor..."
    :error="error"
    @retry="fetchWeather"
  >
    <!-- Weather Content -->
    <div v-if="weatherData" class="space-y-4">
      <!-- Current Weather -->
      <div class="text-center">
        <div class="flex items-center justify-center mb-2">
          <Icon 
            :icon="getWeatherIcon(weatherData.current.weather_code)"
            class="w-16 h-16 text-blue-500"
          />
        </div>
        <h3 class="text-2xl font-bold theme-text-primary mb-1">
          {{ Math.round(weatherData.current.temperature_2m) }}°C
        </h3>
        <p class="text-sm theme-text-secondary capitalize">
          {{ getWeatherDescription(weatherData.current.weather_code) }}
        </p>
        <p class="text-xs theme-text-secondary mt-1">
          <Icon icon="heroicons:map-pin" class="w-3 h-3 inline mr-1" />
          {{ props.city }}
        </p>
      </div>

      <!-- Weather Details -->
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="text-center p-2 theme-bg-secondary rounded-lg">
          <Icon icon="heroicons:wind" class="w-4 h-4 mx-auto mb-1 theme-text-secondary" />
          <p class="text-xs theme-text-secondary mb-1">Rüzgar</p>
          <p class="font-medium">{{ Math.round(weatherData.current.wind_speed_10m) }} km/h</p>
        </div>

        <div class="text-center p-2 theme-bg-secondary rounded-lg">
          <Icon icon="heroicons:water" class="w-4 h-4 mx-auto mb-1 theme-text-secondary" />
          <p class="text-xs theme-text-secondary mb-1">Nem</p>
          <p class="font-medium">{{ Math.round(weatherData.current.relative_humidity_2m) }}%</p>
        </div>

        <div class="text-center p-2 theme-bg-secondary rounded-lg">
          <Icon icon="heroicons:cloud" class="w-4 h-4 mx-auto mb-1 theme-text-secondary" />
          <p class="text-xs theme-text-secondary mb-1">Bulutluluk</p>
          <p class="font-medium">{{ Math.round(weatherData.current.cloud_cover) }}%</p>
        </div>

        <div class="text-center p-2 theme-bg-secondary rounded-lg">
          <Icon icon="heroicons:sun" class="w-4 h-4 mx-auto mb-1 theme-text-secondary" />
          <p class="text-xs theme-text-secondary mb-1">UV İndeksi</p>
          <p class="font-medium">{{ weatherData.current.uv_index ? Math.round(weatherData.current.uv_index) : 'N/A' }}</p>
        </div>
      </div>

      <!-- Temperature Range -->
      <div class="flex justify-between items-center pt-2 border-t theme-border-primary">
        <div class="text-center">
          <p class="text-xs theme-text-secondary">Bugün Min</p>
          <p class="font-medium text-blue-500">{{ Math.round(weatherData.daily.temperature_2m_min[0]) }}°</p>
        </div>
        <div class="text-center">
          <p class="text-xs theme-text-secondary">Hissedilen</p>
          <p class="font-medium">{{ Math.round(weatherData.current.apparent_temperature) }}°</p>
        </div>
        <div class="text-center">
          <p class="text-xs theme-text-secondary">Bugün Max</p>
          <p class="font-medium text-red-500">{{ Math.round(weatherData.daily.temperature_2m_max[0]) }}°</p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <template #actions v-if="weatherData">
      <div class="flex justify-between items-center text-xs theme-text-secondary">
        <span>Son güncelleme: {{ formatTime(lastUpdated) }}</span>
        <button 
          @click="fetchWeather"
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
import { ref, onMounted, onUnmounted } from 'vue'
import BaseWidget from './base/BaseWidget.vue'

// Props
const props = defineProps({
  city: { type: String, default: 'Ankara' },
  latitude: { type: Number, default: 39.9334 }, // Ankara coordinates
  longitude: { type: Number, default: 32.8597 },
  autoRefresh: { type: Boolean, default: true },
  refreshInterval: { type: Number, default: 300000 } // 5 minutes
})

// State
const weatherData = ref(null)
const isLoading = ref(false)
const error = ref('')
const lastUpdated = ref(new Date())

// Methods
const fetchWeather = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${props.latitude}&longitude=${props.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m,uv_index&daily=temperature_2m_max,temperature_2m_min&timezone=Europe/Istanbul&forecast_days=1`
    
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Hava durumu bilgisi alınamadı')
    }

    const data = await response.json()
    weatherData.value = data
    lastUpdated.value = new Date()
    error.value = ''
  } catch (err) {
    error.value = err.message || 'Bir hata oluştu'
    weatherData.value = null
  } finally {
    isLoading.value = false
  }
}

// Weather icon mapping based on WMO Weather interpretation codes
const getWeatherIcon = (code) => {
  const iconMap = {
    0: 'heroicons:sun',           // Clear sky
    1: 'heroicons:sun',           // Mainly clear
    2: 'heroicons:cloud-sun',     // Partly cloudy
    3: 'heroicons:cloud',         // Overcast
    45: 'heroicons:cloud',        // Fog
    48: 'heroicons:cloud',        // Depositing rime fog
    51: 'heroicons:cloud-rain',   // Light drizzle
    53: 'heroicons:cloud-rain',   // Moderate drizzle
    55: 'heroicons:cloud-rain',   // Dense drizzle
    61: 'heroicons:cloud-rain',   // Slight rain
    63: 'heroicons:cloud-rain',   // Moderate rain
    65: 'heroicons:cloud-rain',   // Heavy rain
    71: 'heroicons:snowflake',    // Slight snow
    73: 'heroicons:snowflake',    // Moderate snow
    75: 'heroicons:snowflake',    // Heavy snow
    95: 'heroicons:bolt',         // Thunderstorm
    96: 'heroicons:bolt',         // Thunderstorm with hail
    99: 'heroicons:bolt'          // Thunderstorm with heavy hail
  }
  return iconMap[code] || 'heroicons:question-mark-circle'
}

// Weather description mapping
const getWeatherDescription = (code) => {
  const descriptionMap = {
    0: 'Açık',
    1: 'Çoğunlukla açık',
    2: 'Parçalı bulutlu',
    3: 'Kapalı',
    45: 'Sisli',
    48: 'Buzlu sis',
    51: 'Hafif çiseliyor',
    53: 'Çiseliyor',
    55: 'Yoğun çiseleme',
    61: 'Hafif yağmur',
    63: 'Yağmurlu',
    65: 'Şiddetli yağmur',
    71: 'Hafif kar',
    73: 'Karlı',
    75: 'Şiddetli kar',
    95: 'Gök gürültülü',
    96: 'Dolu ile gök gürültülü',
    99: 'Şiddetli dolu'
  }
  return descriptionMap[code] || 'Bilinmeyen'
}

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
    refreshTimer = setInterval(fetchWeather, props.refreshInterval)
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
  fetchWeather()
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