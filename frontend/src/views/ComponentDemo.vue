<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Vuetify Integration Demo</h1>
      <p class="text-lg text-gray-600">
        This page demonstrates Vuetify components integrated with your existing design system.
      </p>
    </div>

    <!-- Vuetify Components Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Vuetify Components</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Buttons Demo -->
        <v-card class="pa-6">
          <v-card-title>Buttons</v-card-title>
          <v-card-text>
            <div class="d-flex flex-wrap gap-3 mb-4">
              <v-btn color="primary">Primary</v-btn>
              <v-btn color="secondary">Secondary</v-btn>
              <v-btn color="success">Success</v-btn>
              <v-btn color="error">Error</v-btn>
            </div>
            
            <div class="d-flex flex-wrap gap-3 mb-4">
              <v-btn variant="outlined" color="primary">Outlined</v-btn>
              <v-btn variant="text" color="primary">Text</v-btn>
              <v-btn variant="tonal" color="primary">Tonal</v-btn>
            </div>
            
            <div class="d-flex flex-wrap gap-3">
              <v-btn size="small">Small</v-btn>
              <v-btn size="default">Default</v-btn>
              <v-btn size="large">Large</v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Inputs Demo -->
        <v-card class="pa-6">
          <v-card-title>Input Fields</v-card-title>
          <v-card-text>
            <v-text-field
              label="Standard Input"
              placeholder="Enter text"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            
            <v-text-field
              label="Email"
              type="email"
              placeholder="your@email.com"
              variant="outlined"
              prepend-inner-icon="mdi-email"
              class="mb-4"
            ></v-text-field>
            
            <v-text-field
              label="Search"
              placeholder="Search..."
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              clearable
            ></v-text-field>
          </v-card-text>
        </v-card>
      </div>
    </section>

    <!-- Custom Components with Vuetify Integration -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Mixed Components Demo</h2>
      
      <v-card class="pa-6">
        <v-card-title>Contact Form</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleSubmit">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.firstName"
                  label="First Name"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.lastName"
                  label="Last Name"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-text-field
              v-model="form.email"
              label="Email"
              type="email"
              variant="outlined"
              prepend-inner-icon="mdi-email"
              required
              class="mb-4"
            ></v-text-field>
            
            <v-textarea
              v-model="form.message"
              label="Message"
              variant="outlined"
              rows="4"
              counter="500"
              class="mb-4"
            ></v-textarea>
            
            <div class="d-flex justify-space-between align-center">
              <v-chip color="info" size="small">
                <v-icon start>mdi-information</v-icon>
                All fields are required
              </v-chip>
              
              <div class="d-flex gap-2">
                <v-btn variant="outlined" color="grey">
                  Cancel
                </v-btn>
                <v-btn 
                  color="primary" 
                  :loading="isSubmitting"
                  type="submit"
                  prepend-icon="mdi-send"
                >
                  Send Message
                </v-btn>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </section>

    <!-- Chips and Badges -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Chips & Status Indicators</h2>
      
      <v-card class="pa-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3">Status Chips</h3>
          <div class="d-flex flex-wrap gap-2">
            <v-chip color="success" size="small">
              <v-icon start>mdi-check-circle</v-icon>
              Active
            </v-chip>
            <v-chip color="warning" size="small">
              <v-icon start>mdi-clock</v-icon>
              Pending
            </v-chip>
            <v-chip color="error" size="small">
              <v-icon start>mdi-close-circle</v-icon>
              Inactive
            </v-chip>
            <v-chip color="info" size="small">
              <v-icon start>mdi-information</v-icon>
              Info
            </v-chip>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-3">Category Tags</h3>
          <div class="d-flex flex-wrap gap-2">
            <v-chip variant="outlined" color="primary">Haber</v-chip>
            <v-chip variant="outlined" color="secondary">Teknoloji</v-chip>
            <v-chip variant="outlined" color="success">Analiz</v-chip>
            <v-chip variant="tonal" color="primary">Kara</v-chip>
            <v-chip variant="tonal" color="secondary">Deniz</v-chip>
            <v-chip variant="tonal" color="info">Hava</v-chip>
          </div>
        </div>
      </v-card>
    </section>

    <!-- Data Display -->
    <section>
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Data Display</h2>
      
      <v-row>
        <v-col cols="12" md="4">
          <v-card>
            <v-img
              src="https://picsum.photos/400/200"
              height="200"
              cover
            ></v-img>
            <v-card-title>News Article</v-card-title>
            <v-card-text>
              This is a sample news article card using Vuetify components with your custom theme colors.
            </v-card-text>
            <v-card-actions>
              <v-btn variant="text" color="primary">Read More</v-btn>
              <v-spacer></v-spacer>
              <v-btn icon="mdi-heart" variant="text" color="grey"></v-btn>
              <v-btn icon="mdi-share" variant="text" color="grey"></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="8">
          <v-card class="pa-6">
            <v-card-title>Statistics</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6" md="3">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-primary">1,234</div>
                    <div class="text-sm text-grey">Total Articles</div>
                  </div>
                </v-col>
                <v-col cols="6" md="3">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-secondary">567</div>
                    <div class="text-sm text-grey">Categories</div>
                  </div>
                </v-col>
                <v-col cols="6" md="3">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-success">890</div>
                    <div class="text-sm text-grey">Subscribers</div>
                  </div>
                </v-col>
                <v-col cols="6" md="3">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-info">12k</div>
                    <div class="text-sm text-grey">Page Views</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ComponentDemo',
  data() {
    return {
      isSubmitting: false,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      }
    }
  },
  methods: {
    async handleSubmit() {
      this.isSubmitting = true
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Reset form
      this.form = {
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      }
      
      this.isSubmitting = false
      
      // Show success message
      alert('Message sent successfully!')
    }
  }
}
</script>

<style scoped>
/* Custom styles to complement Vuetify */
.text-primary {
  color: rgb(var(--v-theme-primary)) !important;
}

.text-secondary {
  color: rgb(var(--v-theme-secondary)) !important;
}

.text-success {
  color: rgb(var(--v-theme-success)) !important;
}

.text-info {
  color: rgb(var(--v-theme-info)) !important;
}
</style>