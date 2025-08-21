<template>
  <div class="text-center py-8">
    <slot name="icon">
      <Icon icon="heroicons:folder" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
    </slot>
    <p class="text-sm text-gray-500">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, required: true }
})
</script>
