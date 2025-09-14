<template>
  <form @submit.prevent="$emit('submit')" class="space-y-6">
    <FormInput
      v-model="formData.name"
      type="text"
      label="Ad Soyad"
      autocomplete="name"
      required
      :error="errors.name"
    />

    <FormInput
      v-model="formData.email"
      type="email"
      label="E-posta"
      autocomplete="email"
      required
      :error="errors.email"
    />

    <div class="space-y-4">
      <FormInput
        v-model="formData.password"
        type="password"
        label="Şifre"
        autocomplete="new-password"
        required
        :error="errors.password"
        help-text="Şifre en az 6 karakter, bir küçük harf, bir büyük harf ve bir rakam/özel karakter içermelidir"
      />

      <FormInput
        v-model="formData.confirmPassword"
        type="password"
        label="Şifre Tekrar"
        autocomplete="new-password"
        required
        :error="errors.confirmPassword"
      />
    </div>

    <FormCheckbox
      v-model="formData.acceptTerms"
      :label="termsLabel"
      align-top
    />

    <FormButton
      type="submit"
      variant="primary"
      text="Kayıt Ol"
      :is-loading="isLoading"
      full-width
    />
  </form>
</template>

<script setup>
import FormInput from '@/components/forms/FormInput.vue'
import FormCheckbox from '@/components/forms/FormCheckbox.vue'
import FormButton from '@/components/forms/FormButton.vue'

defineProps({
  formData: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  isLoading: { type: Boolean, default: false },
  termsLabel: {
    type: String,
    default: '<a href="/terms" target="_blank" class="text-indigo-400 hover:text-indigo-300">Kullanım Şartları</a>\'nı ve <a href="/privacy" target="_blank" class="text-indigo-400 hover:text-indigo-300">Gizlilik Politikası</a>\'nı kabul ediyorum'
  }
})

defineEmits(['submit'])
</script>