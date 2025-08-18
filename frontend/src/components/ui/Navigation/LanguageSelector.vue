<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="p-2 text-white hover:bg-gray-700 rounded-full transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-3.25m0-9.75V15M12 3l2.25 2.25L12 3zm0 0l-2.25 2.25L12 3z"/>
      </svg>
    </button>

    <!-- Language Dropdown -->
    <div
      v-if="showDropdown"
      class="absolute right-0 top-full mt-2 w-40 bg-white text-gray-800 shadow-lg rounded-lg py-2 z-50"
      @mouseleave="hideDropdown"
    >
      <button
        v-for="language in languages"
        :key="language.code"
        @click="selectLanguage(language)"
        class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center"
        :class="{
          'bg-primary/10 text-primary': currentLanguage === language.name,
        }"
      >
        <span class="mr-2">{{ language.flag }}</span>
        <span>{{ language.name }}</span>
        <svg
          v-if="currentLanguage === language.name"
          class="w-4 h-4 ml-auto text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  languages: { type: Array, required: true },
  currentLanguage: { type: String, required: true }
})

const emit = defineEmits(['languageChanged'])

const showDropdown = ref(false)
let dropdownTimeout = null

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const hideDropdown = () => {
  dropdownTimeout = setTimeout(() => {
    showDropdown.value = false
  }, 150)
}

const selectLanguage = (language) => {
  emit('languageChanged', language)
  showDropdown.value = false
  clearTimeout(dropdownTimeout)
}
</script>