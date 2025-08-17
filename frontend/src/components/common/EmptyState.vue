<template>
  <div class="text-center py-8">
    <slot name="icon">
      <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
      </svg>
    </slot>
    <p class="text-sm text-gray-500">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, required: true }
})
</script>
