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
        <span class="block text-sm font-medium text-gray-100">Şifre</span>
        <button
          type="button"
          @click="$emit('forgotPassword')"
          class="text-sm text-indigo-400 hover:text-indigo-300"
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

    <FormCheckbox
      v-model="formData.rememberMe"
      label="Beni hatırla"
    />

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
import FormCheckbox from '@/components/forms/FormCheckbox.vue'
import FormButton from '@/components/forms/FormButton.vue'

defineProps({
  formData: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  isLoading: { type: Boolean, default: false }
})

defineEmits(['submit', 'forgotPassword'])
</script>