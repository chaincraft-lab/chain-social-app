<template>
  <form @submit.prevent="$emit('submit')" class="space-y-6">
    <FormInput
      v-model="formData.email"
      type="email"
      label="E-posta"
      autocomplete="email"
      required
      :error="errors.email"
    />

    <div>
      <div class="flex items-center justify-between">
        <span class="block text-sm font-medium text-gray-700 dark:text-gray-300">Şifre</span>
        <button
          type="button"
          @click="$emit('forgotPassword')"
          class="text-sm text-primary hover:text-primary/80"
        >
          Şifremi unuttum?
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
      text="Giriş Yap"
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