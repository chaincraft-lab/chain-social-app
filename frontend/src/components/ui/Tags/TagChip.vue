<!-- components/common/TagChip.vue -->
<template>
  <router-link
    :to="to"
    class="inline-flex items-center px-4 py-2 bg-gray-100 
           hover:bg-primary text-gray-600 hover:text-white 
           text-base font-medium rounded-full border border-gray-200 
           hover:border-primary transition-all duration-200 ease-in-out 
           transform hover:scale-105 hover:-translate-y-0.5"
  >
    #{{ label }}
  </router-link>
</template>

<script>
export default {
  name: 'TagChip',
  props: {
    label: { type: String, required: true },
    to: { type: [Object, String], required: true }
  }
}
</script>
