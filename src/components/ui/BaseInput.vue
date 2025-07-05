<template>
  <div>
    <label 
      v-if="label" 
      :for="id" 
      class="block mb-1 text-sm font-medium text-dark"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <div 
        v-if="$slots.prefix" 
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
      >
        <slot name="prefix"></slot>
      </div>
      
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :class="[
          'w-full border focus:outline-none focus:ring-2 transition-colors',
          sizeClasses,
          stateClasses,
          roundedClasses,
          { 'pl-10': $slots.prefix },
          { 'pr-10': $slots.suffix || clearable },
          className
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      
      <div 
        v-if="clearable && modelValue" 
        class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
        @click="$emit('update:modelValue', '')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      
      <div 
        v-else-if="$slots.suffix" 
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
      >
        <slot name="suffix"></slot>
      </div>
    </div>
    
    <div 
      v-if="error" 
      class="mt-1 text-sm text-red-600"
    >
      {{ error }}
    </div>
    
    <div 
      v-else-if="hint" 
      class="mt-1 text-sm text-gray-500"
    >
      {{ hint }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    id: {
      type: String,
      default() {
        return `input-${Math.random().toString(36).substring(2, 9)}`
      }
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
    stateClasses() {
      const states = {
        default: 'border-gray-300 focus:border-primary focus:ring-primary/50',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500/50',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
        warning: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/50'
      }
      
      // If there's an error message, use error state regardless of state prop
      if (this.error) {
        return states.error
      }
      
      return states[this.state] || states.default
    },
    sizeClasses() {
      const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-5 py-2.5 text-lg'
      }
      
      return sizes[this.size] || sizes.md
    },
    roundedClasses() {
      const rounded = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full'
      }
      
      return rounded[this.rounded] || rounded.md
    }
  }
}
</script> 