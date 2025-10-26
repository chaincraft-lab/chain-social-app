<template>
  <div class="relative">
    <form @submit.prevent="$emit('search', query)">
      <input
        v-model="query"
        type="text"
        :placeholder="placeholder || $t('navigation.search.placeholder')"
        :class="[
          'py-2 pl-10 pr-4 text-sm border-none rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors',
          inputClass
        ]"
        @keyup.enter="$emit('search', query)"
      />
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon
          icon="heroicons:magnifying-glass"
          class="w-4 h-4 theme-text-muted"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  inputClass: { type: String, default: 'w-64 theme-input placeholder-opacity-70' }
})

const emit = defineEmits(['search', 'update:modelValue'])

const query = ref(props.modelValue)

watch(query, (newValue) => {
  emit('update:modelValue', newValue)
})

watch(() => props.modelValue, (newValue) => {
  query.value = newValue
})
</script>