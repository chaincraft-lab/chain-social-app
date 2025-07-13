import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/css/main.css'
import { newsService, advertisementService } from './api'

// Import layouts and pages
import MainLayout from './layouts/MainLayout.vue'
import HomePage from './views/HomePage.vue'
import CategoryPage from './views/CategoryPage.vue'
import ArticlePage from './views/ArticlePage.vue'
import DefenseLeaguePage from './views/DefenseLeaguePage.vue'

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: HomePage, name: 'home' },
        { path: '/category/:slug', component: CategoryPage, name: 'category' },
        { path: '/article/:slug', component: ArticlePage, name: 'article' },
        { path: '/defense-leagues', component: DefenseLeaguePage, name: 'defense-leagues' },
        { path: '/defense-leagues/:category', component: DefenseLeaguePage, name: 'defense-leagues-category' }
      ]
    }
  ]
})

// Create store
const store = createStore({
  state() {
    return {
      categories: [],
      latestNews: [],
      popularNews: [],
      featuredNews: [],
      advertisements: []
    }
  },
  mutations: {
    setCategories(state, categories) {
      state.categories = categories
    },
    setLatestNews(state, news) {
      state.latestNews = news
    },
    setPopularNews(state, news) {
      state.popularNews = news
    },
    setFeaturedNews(state, news) {
      state.featuredNews = news
    },
    setAdvertisements(state, ads) {
      state.advertisements = ads
    }
  },
  actions: {
    async fetchCategories({ commit }) {
      try {
        const response = await newsService.getCategories()
        commit('setCategories', response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    async fetchLatestNews({ commit }) {
      try {
        const response = await newsService.getLatestNews(10)
        commit('setLatestNews', response.data)
      } catch (error) {
        console.error('Error fetching latest news:', error)
      }
    },
    async fetchPopularNews({ commit }) {
      try {
        const response = await newsService.getPopularNews(5)
        commit('setPopularNews', response.data)
      } catch (error) {
        console.error('Error fetching popular news:', error)
      }
    },
    async fetchFeaturedNews({ commit }) {
      try {
        const response = await newsService.getFeaturedNews(3)
        commit('setFeaturedNews', response.data)
      } catch (error) {
        console.error('Error fetching featured news:', error)
      }
    },
    async fetchAdvertisements({ commit }, position) {
      try {
        const response = await advertisementService.getAdvertisements(position)
        commit('setAdvertisements', response.data)
      } catch (error) {
        console.error('Error fetching advertisements:', error)
      }
    },
    async fetchInitialData({ dispatch }) {
      await Promise.all([
        dispatch('fetchCategories'),
        dispatch('fetchLatestNews'),
        dispatch('fetchPopularNews'),
        dispatch('fetchFeaturedNews'),
        dispatch('fetchAdvertisements')
      ])
    }
  }
})

// Create app
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
