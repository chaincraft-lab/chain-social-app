import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/css/main.css'
import './assets/css/theme.css'
import store from './store'
import vuetify from './plugins/vuetify'
import { Icon } from '@iconify/vue'

// Import layouts and pages
import MainLayout from './layouts/MainLayout.vue'
import HomePage from './views/HomePage.vue'
import CategoryPage from './views/CategoryPage.vue'
import TagPage from './views/TagPage.vue'
import SearchPage from './views/SearchPage.vue'
import ArticlePage from './views/ArticlePage.vue'
import BookmarksPage from './views/BookmarksPage.vue'
import LikesPage from './views/LikesPage.vue'
import ProfilePage from './views/ProfilePage.vue'

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
        { path: '/category/:categorySlug/:subSlug', component: CategoryPage, name: 'subcategory' },
        { path: '/tag/:slug', component: TagPage, name: 'tag' },
        { path: '/search', component: SearchPage, name: 'search' },
        { path: '/article/:slug', component: ArticlePage, name: 'article' },
        { 
          path: '/bookmarks', 
          component: BookmarksPage, 
          name: 'bookmarks',
          meta: { requiresAuth: true }
        },
        { 
          path: '/likes', 
          component: LikesPage, 
          name: 'likes',
          meta: { requiresAuth: true }
        },
        { 
          path: '/profile', 
          component: ProfilePage, 
          name: 'profile',
          meta: { requiresAuth: true }
        },
      ]
    }
  ]
})

// Add navigation guard for protected routes
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if user is authenticated
    if (store.getters['user/isAuthenticated']) {
      next()
    } else {
      // Redirect to home with a message
      store.dispatch('notifications/addNotification', {
        type: 'warning',
        message: 'Bu sayfaya erişmek için giriş yapmalısınız'
      })
      next('/')
    }
  } else {
    next()
  }
})

// Create app
const app = createApp(App)
app.use(router)
app.use(store)
app.use(vuetify)
app.component('Icon', Icon)

// Initialize authentication and theme state before mounting
Promise.all([
  store.dispatch('user/initializeAuth'),
  store.dispatch('theme/initializeTheme')
]).finally(() => {
  app.mount('#app')
})
