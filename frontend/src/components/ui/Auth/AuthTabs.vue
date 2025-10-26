<template>
  <div class="flex bg-gray-800 rounded-lg p-1 mb-6">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      @click="$emit('update:modelValue', tab.value)"
      :class="[
        'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all',
        modelValue === tab.value 
          ? 'bg-indigo-500 text-white' 
          : 'text-gray-400 hover:text-white'
      ]"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  modelValue: { type: String, default: 'login' }
})

const tabs = computed(() => [
  { value: 'login', label: t('auth.login.title') },
  { value: 'register', label: t('auth.register.title') }
])

defineEmits(['update:modelValue'])
</script>