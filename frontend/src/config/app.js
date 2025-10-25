export const APP_CONFIG = {
  name: 'ArbitrumSocial',
  protocol: 'Arbitrum',
  description: 'Arbitrum ekosistemine özel blockchain haberleri ve sosyal platform',
  url: process.env.VUE_APP_URL || 'http://localhost:3000',
  api: {
    baseUrl: process.env.VUE_APP_API_URL || 'http://localhost:5000/api'
  }
}