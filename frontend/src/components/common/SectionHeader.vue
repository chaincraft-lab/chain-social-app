<template>
  <div class="border-b theme-border-primary px-4 py-4">
    <h3 class="text-xl font-semibold theme-text-primary flex items-center">
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
