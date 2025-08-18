<template>
  <div class="space-y-6">
    <div class="text-center mb-6">
      <div class="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100">
        <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      </div>
      <h3 class="mt-4 text-lg font-semibold text-white">Şifremi Unuttum</h3>
      <p class="mt-2 text-sm text-gray-400">E-posta adresinizi girin, şifre sıfırlama bağlantısını size göndereceğiz.</p>
    </div>

    <form @submit.prevent="$emit('submit')">
      <FormInput
        v-model="formData.email"
        type="email"
        label="E-posta"
        autocomplete="email"
        required
        :error="errors.email"
      />

      <FormButton
        type="submit"
        variant="primary"
        text="Şifre Sıfırlama Gönder"
        :is-loading="isLoading"
        full-width
        class="mt-4"
      />

      <FormButton
        type="button"
        variant="ghost"
        text="← Giriş sayfasına dön"
        full-width
        class="mt-3"
        @click="$emit('backToLogin')"
      />
    </form>
  </div>
</template>

<script setup>
import FormInput from '@/components/forms/FormInput.vue'
import FormButton from '@/components/forms/FormButton.vue'

defineProps({
  formData: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  isLoading: { type: Boolean, default: false }
})

defineEmits(['submit', 'backToLogin'])
</script>