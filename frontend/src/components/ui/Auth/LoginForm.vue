<template>
  <form @submit.prevent="$emit('submit')" class="space-y-6">
    <FormInput
      v-model="formData.email"
      type="email"
      :label="$t('auth.login.email')"
      autocomplete="email"
      required
      :error="errors.email"
    />

    <div>
      <div class="flex items-center justify-between">
        <span class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('auth.login.password') }}</span>
        <button
          type="button"
          @click="$emit('forgotPassword')"
          class="text-sm text-primary hover:text-primary/80"
        >
          {{ $t('auth.login.forgotPassword') }}
        </button>
      </div>
      <FormInput
        v-model="formData.password"
        type="password"
        autocomplete="current-password"
        required
        :error="errors.password"
      />
    </div>

    <FormButton
      type="submit"
      variant="primary"
      :text="$t('auth.login.submit')"
      :is-loading="isLoading"
      full-width
    />
  </form>
</template>

<script setup>
import FormInput from '@/components/forms/FormInput.vue'
import FormButton from '@/components/forms/FormButton.vue'

defineProps({
  formData: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  isLoading: { type: Boolean, default: false }
})

defineEmits(['submit', 'forgotPassword'])
</script>