<template>
  <div class="contact-page">
    <div class="contact-hero">
      <h1 class="contact-title">İletişim</h1>
      <p class="contact-subtitle">Bizimle iletişime geçin</p>
    </div>
    
    <div class="contact-content">
      <div class="contact-info">
        <h2>İletişim Bilgileri</h2>
        <div class="info-item">
          <v-icon>mdi-email</v-icon>
          <span>info@savunmahaberleri.com</span>
        </div>
        <div class="info-item">
          <v-icon>mdi-phone</v-icon>
          <span>+90 (212) 123 45 67</span>
        </div>
        <div class="info-item">
          <v-icon>mdi-map-marker</v-icon>
          <span>İstanbul, Türkiye</span>
        </div>
      </div>
      
      <div class="contact-form">
        <h2>Mesaj Gönder</h2>
        <v-form @submit.prevent="sendMessage">
          <v-text-field
            v-model="form.name"
            label="Ad Soyad"
            required
            variant="outlined"
            class="mb-4"
          ></v-text-field>
          
          <v-text-field
            v-model="form.email"
            label="E-posta"
            type="email"
            required
            variant="outlined"
            class="mb-4"
          ></v-text-field>
          
          <v-text-field
            v-model="form.subject"
            label="Konu"
            required
            variant="outlined"
            class="mb-4"
          ></v-text-field>
          
          <v-textarea
            v-model="form.message"
            label="Mesaj"
            required
            variant="outlined"
            rows="5"
            class="mb-4"
          ></v-textarea>
          
          <v-btn
            type="submit"
            color="primary"
            size="large"
            :loading="sending"
          >
            Mesaj Gönder
          </v-btn>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactPage',
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      sending: false
    }
  },
  methods: {
    async sendMessage() {
      this.sending = true
      // Simulate sending
      setTimeout(() => {
        alert('Mesajınız başarıyla gönderildi!')
        this.form = {
          name: '',
          email: '',
          subject: '',
          message: ''
        }
        this.sending = false
      }, 1000)
    }
  }
}
</script>

<style scoped>
.contact-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.contact-hero {
  text-align: center;
  margin-bottom: 3rem;
}

.contact-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.contact-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.contact-info h2,
.contact-form h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .contact-page {
    padding: 1rem 0.5rem;
  }
  
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-title {
    font-size: 2rem;
  }
}
</style>