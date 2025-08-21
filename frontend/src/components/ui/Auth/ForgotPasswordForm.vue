<template>
  <div class="space-y-6">
    <div class="text-center mb-6">
      <div class="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100">
        <Icon icon="heroicons:envelope" class="w-6 h-6 text-indigo-500" />
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