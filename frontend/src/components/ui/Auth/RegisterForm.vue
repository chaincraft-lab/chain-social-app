<template>
  <form @submit.prevent="$emit('submit')" class="space-y-6">
    <FormInput
      v-model="formData.name"
      type="text"
      :label="$t('auth.register.fullName')"
      autocomplete="name"
      required
      :error="errors.name"
    />

    <FormInput
      v-model="formData.email"
      type="email"
      :label="$t('auth.register.email')"
      autocomplete="email"
      required
      :error="errors.email"
    />

    <div class="space-y-4">
      <FormInput
        v-model="formData.password"
        type="password"
        :label="$t('auth.register.password')"
        autocomplete="new-password"
        required
        :error="errors.password"
        :help-text="$t('auth.register.passwordHelp')"
      />

      <FormInput
        v-model="formData.confirmPassword"
        type="password"
        :label="$t('auth.register.confirmPassword')"
        autocomplete="new-password"
        required
        :error="errors.confirmPassword"
      />
    </div>

    <FormCheckbox
      v-model="formData.acceptTerms"
      :label="termsLabel || $t('auth.register.acceptTerms')"
      align-top
    />

    <FormButton
      type="submit"
      variant="primary"
      :text="$t('auth.register.submit')"
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
    default: ''
  }
})

defineEmits(['submit'])
</script>