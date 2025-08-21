<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="p-2 theme-text-primary hover:theme-bg-secondary rounded-full transition-colors"
    >
      <!-- Dünya ikonu -->
      <Icon icon="heroicons:globe-alt" class="w-5 h-5" />
    </button>

    <!-- Language Dropdown -->
    <div
      v-if="showDropdown"
      class="absolute right-0 top-full mt-2 w-40 theme-card shadow-lg rounded-lg py-2 z-50"
      @mouseleave="hideDropdown"
    >
      <button
        v-for="language in languages"
        :key="language.code"
        @click="selectLanguage(language)"
        class="w-full text-left px-4 py-2 text-sm hover:theme-bg-secondary transition-colors flex items-center theme-text-secondary"
        :class="{
          'bg-primary/10 text-primary': currentLanguage === language.name,
        }"
      >
        <span class="mr-2">{{ language.flag }}</span>
        <span>{{ language.name }}</span>
        <Icon
          v-if="currentLanguage === language.name"
          icon="heroicons:check"
          class="w-4 h-4 ml-auto text-green-500"
        />
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