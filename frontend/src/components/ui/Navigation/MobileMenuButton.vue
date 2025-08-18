<template>
  <button
    @click="$emit('toggle')"
    class="p-2 text-white hover:bg-gray-700 rounded-full transition-colors md:hidden"
  >
    <svg
      class="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        v-if="!isOpen"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
      <path
        v-else
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
</template>

<script setup>
defineProps({
  isOpen: { type: Boolean, default: false }
})

defineEmits(['toggle'])
</script>