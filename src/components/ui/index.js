// UI Component Index - allows easy switching between Vuetify and custom components

// Import custom components
import BaseButton from './BaseButton.vue'
import BaseCard from './BaseCard.vue'
import BaseInput from './BaseInput.vue'
import BaseBadge from './BaseBadge.vue'

// Import Vuetify wrapper components
import VuetifyButton from './VuetifyButton.vue'
import VuetifyCard from './VuetifyCard.vue'
import VuetifyInput from './VuetifyInput.vue'
import VuetifyBadge from './VuetifyBadge.vue'

// Configuration flag - set to true to use Vuetify components, false for custom
const USE_VUETIFY = true

// Export the appropriate components based on configuration
export const Button = USE_VUETIFY ? VuetifyButton : BaseButton
export const Card = USE_VUETIFY ? VuetifyCard : BaseCard
export const Input = USE_VUETIFY ? VuetifyInput : BaseInput
export const Badge = USE_VUETIFY ? VuetifyBadge : BaseBadge

// Export all components individually for specific use cases
export {
  // Custom components
  BaseButton,
  BaseCard,
  BaseInput,
  BaseBadge,
  
  // Vuetify components
  VuetifyButton,
  VuetifyCard,
  VuetifyInput,
  VuetifyBadge
}

// Plugin function for global registration
export default {
  install(app) {
    // Register the active components globally
    app.component('Button', Button)
    app.component('Card', Card)
    app.component('Input', Input)
    app.component('Badge', Badge)
    
    // Also register with prefixed names for clarity
    if (USE_VUETIFY) {
      app.component('VButton', VuetifyButton)
      app.component('VCard', VuetifyCard)
      app.component('VInput', VuetifyInput)
      app.component('VBadge', VuetifyBadge)
    } else {
      app.component('BaseButton', BaseButton)
      app.component('BaseCard', BaseCard)
      app.component('BaseInput', BaseInput)
      app.component('BaseBadge', BaseBadge)
    }
  }
}