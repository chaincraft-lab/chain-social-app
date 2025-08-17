<template>
  <div class="border-b border-gray-200 px-5 py-3">
    <h3 class="text-lg font-semibold text-dark flex items-center">
      <slot name="icon" />
      {{ title }}
    </h3>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true }
})
</script>
