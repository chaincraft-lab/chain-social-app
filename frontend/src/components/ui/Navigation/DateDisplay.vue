<template>
  <div class="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 rounded-lg px-3 py-2 flex items-center space-x-2 cursor-pointer hover:from-primary/15 hover:to-primary/8 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300">
    <Icon icon="heroicons:calendar-days" class="w-4 h-4 text-primary" />
    <div class="flex flex-col">
      <span class="text-xs font-medium text-primary">{{ currentDay }}</span>
      <span class="text-xs text-gray-300">{{ currentDateFormatted }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentDay = ref('')
const currentDateFormatted = ref('')
let dateInterval = null

const updateCurrentDate = () => {
  const now = new Date()
  const dayOptions = { weekday: 'long' }
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' }

  currentDay.value = now.toLocaleDateString('tr-TR', dayOptions)
  currentDateFormatted.value = now.toLocaleDateString('tr-TR', dateOptions)
}

onMounted(() => {
  updateCurrentDate()
  // Update date every minute
  dateInterval = setInterval(updateCurrentDate, 60000)
})

onUnmounted(() => {
  if (dateInterval) {
    clearInterval(dateInterval)
  }
})
</script>