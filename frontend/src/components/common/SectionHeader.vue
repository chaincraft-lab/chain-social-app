<template>
  <div class="border-b theme-border-primary px-5 py-3">
    <h3 class="text-lg font-semibold theme-text-primary flex items-center">
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
