<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-400 ml-1">*</span>
    </label>
    
    <div class="mt-2 relative">
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :required="required"
        :disabled="disabled"
        :class="[
          'block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm',
          error ? 'border-red-500' : '',
          type === 'password' ? 'pr-10' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        ]"
      />
      
      <!-- Password Toggle Button -->
      <button
        v-if="type === 'password'"
        type="button"
        @click="togglePassword"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <Icon v-if="showPassword" icon="heroicons:eye" class="w-5 h-5" />
        <Icon v-else icon="heroicons:eye-slash" class="w-5 h-5" />
      </button>
    </div>
    
    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-sm text-red-400">{{ error }}</p>
    
    <!-- Help Text -->
    <p v-else-if="helpText" class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ helpText }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  type: { type: String, default: 'text' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  helpText: { type: String, default: '' },
  id: { type: String, default: () => `input-${Math.random().toString(36).substr(2, 9)}` }
})

defineEmits(['update:modelValue'])

const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>