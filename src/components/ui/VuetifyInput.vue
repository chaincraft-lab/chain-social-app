<template>
  <v-text-field
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :type="type"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    :error="!!error"
    :error-messages="error"
    :hint="hint"
    :persistent-hint="!!hint"
    :density="vuetifyDensity"
    :variant="vuetifyVariant"
    :rounded="vuetifyRounded"
    :class="[customClasses, className]"
    @update:model-value="$emit('update:modelValue', $event)"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  >
    <template v-if="$slots.prefix" #prepend-inner>
      <slot name="prefix"></slot>
    </template>
    
    <template v-if="$slots.suffix" #append-inner>
      <slot name="suffix"></slot>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'VuetifyInput',
  emits: ['update:modelValue', 'focus', 'blur'],
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    state: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'success', 'error', 'warning'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    rounded: {
      type: String,
      default: 'md',
      validator: (value) => ['none', 'sm', 'md', 'lg', 'full'].includes(value)
    },
    hint: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    vuetifyDensity() {
      const densityMap = {
        'sm': 'compact',
        'md': 'comfortable',
        'lg': 'default'
      }
      return densityMap[this.size] || 'comfortable'
    },
    
    vuetifyVariant() {
      return 'outlined'
    },
    
    vuetifyRounded() {
      const roundedMap = {
        'none': 0,
        'sm': 'sm',
        'md': 'lg',
        'lg': 'lg',
        'full': 'pill'
      }
      return roundedMap[this.rounded] || 'lg'
    },
    
    customClasses() {
      let classes = ''
      
      // Add state-specific classes if needed
      if (this.state === 'success' && !this.error) {
        classes += 'success-field '
      } else if (this.state === 'warning' && !this.error) {
        classes += 'warning-field '
      }
      
      return classes.trim()
    }
  }
}
</script>

<style scoped>
:deep(.v-field) {
  border-radius: 12px;
}

:deep(.v-field--focused .v-field__outline) {
  --v-field-border-width: 2px;
}

:deep(.success-field .v-field__outline) {
  --v-field-border-color: rgb(16, 185, 129);
}

:deep(.warning-field .v-field__outline) {
  --v-field-border-color: rgb(245, 158, 11);
}
</style>