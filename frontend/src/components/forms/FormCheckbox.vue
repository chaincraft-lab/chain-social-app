<template>
  <div class="flex items-start">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      :required="required"
      :disabled="disabled"
      :class="[
        'h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-indigo-500 focus:ring-indigo-500',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        alignTop ? 'mt-1' : ''
      ]"
    />
    <label v-if="label" :for="id" :class="[
      'ml-2 block text-sm text-gray-700 dark:text-gray-300',
      disabled ? 'opacity-50' : ''
    ]">
      <span v-html="label"></span>
    </label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  alignTop: { type: Boolean, default: false },
  id: { type: String, default: () => `checkbox-${Math.random().toString(36).substr(2, 9)}` }
})

defineEmits(['update:modelValue'])
</script>