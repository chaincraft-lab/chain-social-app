<template>
  <v-card
    :class="[customClasses, className]"
    :elevation="vuetifyElevation"
    :rounded="vuetifyRounded"
    :hover="hover"
  >
    <!-- Image Section -->
    <div v-if="$slots.image" class="overflow-hidden">
      <slot name="image"></slot>
    </div>
    
    <!-- Header Section -->
    <v-card-title 
      v-if="$slots.header"
      :class="['py-3 px-4', headerClass]"
    >
      <slot name="header"></slot>
    </v-card-title>
    
    <!-- Main Content -->
    <v-card-text :class="['px-4 py-4', bodyClass]">
      <slot></slot>
    </v-card-text>
    
    <!-- Footer Section -->
    <v-card-actions 
      v-if="$slots.footer"
      :class="['px-4 py-3', footerClass]"
    >
      <slot name="footer"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'VuetifyCard',
  props: {
    rounded: {
      type: String,
      default: 'md',
      validator: (value) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    shadow: {
      type: String,
      default: 'md',
      validator: (value) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    hover: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    },
    headerClass: {
      type: String,
      default: ''
    },
    bodyClass: {
      type: String,
      default: ''
    },
    footerClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    vuetifyElevation() {
      const elevationMap = {
        'none': 0,
        'sm': 1,
        'md': 2,
        'lg': 4,
        'xl': 8
      }
      return elevationMap[this.shadow] || 2
    },
    
    vuetifyRounded() {
      const roundedMap = {
        'none': 0,
        'sm': 'sm',
        'md': 'lg',
        'lg': 'lg',
        'xl': 'xl'
      }
      return roundedMap[this.rounded] || 'lg'
    },
    
    customClasses() {
      let classes = ''
      
      if (this.border) {
        classes += 'border '
      }
      
      return classes.trim()
    }
  }
}
</script>

<style scoped>
:deep(.v-card-title) {
  padding: 12px 16px;
  font-weight: 600;
}

:deep(.v-card-text) {
  padding: 16px;
}

:deep(.v-card-actions) {
  padding: 12px 16px;
}
</style>