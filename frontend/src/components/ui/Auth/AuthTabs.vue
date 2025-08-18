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
defineProps({
  modelValue: { type: String, default: 'login' },
  tabs: {
    type: Array,
    default: () => [
      { value: 'login', label: 'Giriş Yap' },
      { value: 'register', label: 'Kayıt Ol' }
    ]
  }
})

defineEmits(['update:modelValue'])
</script>