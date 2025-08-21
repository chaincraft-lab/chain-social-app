<template>
  <button
    @click="$emit('toggle')"
    class="p-2 theme-text-primary hover:theme-bg-secondary rounded-full transition-colors md:hidden"
  >
    <Icon
      :icon="isOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'"
      class="w-6 h-6"
    />
  </button>
</template>

<script setup>
defineProps({
  isOpen: { type: Boolean, default: false }
})

defineEmits(['toggle'])
</script>