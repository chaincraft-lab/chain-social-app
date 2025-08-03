<template>
  <div class="news-post">
    <v-card class="post-card" elevation="2" rounded="xl">
      <!-- Post Header -->
      <div class="post-header">
        <div class="author-info">
          <v-avatar size="40" color="primary">
            <span class="text-white font-weight-bold">{{ getAuthorInitials() }}</span>
          </v-avatar>
          <div class="author-details">
            <div class="author-name">{{ news.author?.name || 'Editör' }}</div>
            <div class="post-time">{{ formatDate(news.date) }}</div>
          </div>
        </div>
        <v-btn icon="mdi-dots-vertical" variant="text" size="small"></v-btn>
      </div>

      <!-- Post Image -->
      <div class="post-image-container">
        <v-img 
          :src="news.image" 
          :alt="news.title"
          height="400"
          cover
          class="post-image"
        >
          <!-- Category Badge -->
          <div class="category-badge">
            <v-chip 
              :color="getCategoryColor(news.category?.name)"
              size="small"
              variant="flat"
            >
              {{ news.category?.name }}
            </v-chip>
          </div>
        </v-img>
      </div>

      <!-- Post Actions -->
      <div class="post-actions">
        <div class="action-buttons">
          <v-btn 
            :icon="isLiked ? 'mdi-heart' : 'mdi-heart-outline'"
            :color="isLiked ? 'red' : 'grey'"
            variant="text"
            size="large"
            @click="toggleLike"
          ></v-btn>
          <v-btn icon="mdi-comment-outline" variant="text" size="large" @click="toggleComments"></v-btn>
          <v-btn icon="mdi-share-outline" variant="text" size="large" @click="sharePost"></v-btn>
        </div>
        <v-btn icon="mdi-bookmark-outline" variant="text" size="large" @click="bookmarkPost"></v-btn>
      </div>

      <!-- Engagement Stats -->
      <div class="engagement-stats">
        <div class="likes-count" v-if="likesCount > 0">
          <strong>{{ formatCount(likesCount) }} beğeni</strong>
        </div>
      </div>

      <!-- Post Content -->
      <div class="post-content">
        <div class="post-title">
          <strong>{{ news.author?.name || 'editör' }}</strong>
          {{ news.title }}
        </div>
        <div class="post-excerpt" v-if="news.excerpt">
          {{ news.excerpt }}
        </div>
        
        <!-- Tags -->
        <div class="post-tags" v-if="news.tags && news.tags.length">
          <span 
            v-for="tag in news.tags.slice(0, 3)" 
            :key="tag" 
            class="tag"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- Comments Preview -->
      <div class="comments-preview" v-if="commentsCount > 0">
        <div class="comments-count" @click="toggleComments">
          {{ commentsCount }} yorumun tümünü gör
        </div>
      </div>

      <!-- Comments Section -->
      <div class="comments-section" v-if="showComments">
        <div class="comment-item" v-for="comment in sampleComments" :key="comment.id">
          <v-avatar size="24" color="grey">
            <span class="text-white text-caption">{{ comment.author.charAt(0) }}</span>
          </v-avatar>
          <div class="comment-content">
            <strong>{{ comment.author }}</strong>
            {{ comment.text }}
          </div>
        </div>
        
        <!-- Add Comment -->
        <div class="add-comment">
          <v-text-field
            v-model="newComment"
            placeholder="Yorum ekle..."
            variant="plain"
            hide-details
            density="compact"
            @keyup.enter="addComment"
          >
            <template #append>
              <v-btn 
                color="primary" 
                variant="text" 
                size="small"
                @click="addComment"
                :disabled="!newComment.trim()"
              >
              <v-icon>mdi-send</v-icon>
            </v-btn>
            </template>
          </v-text-field>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'NewsPost',
  props: {
    news: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isLiked: false,
      likesCount: Math.floor(Math.random() * 1000) + 50, // Random likes for demo
      commentsCount: Math.floor(Math.random() * 50) + 5, // Random comments for demo
      showComments: false,
      newComment: '',
      sampleComments: [
        { id: 1, author: 'Ahmet Yılmaz', text: 'Çok önemli bir gelişme! 👍' },
        { id: 2, author: 'Ayşe Demir', text: 'Bu konuda daha fazla detay bekliyoruz.' },
        { id: 3, author: 'Mehmet Kaya', text: 'Harika analiz, teşekkürler!' }
      ]
    }
  },
  methods: {
    getAuthorInitials() {
      const name = this.news.author?.name || 'Editör'
      return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffHours < 1) return 'Az önce'
      if (diffHours < 24) return `${diffHours} saat önce`
      if (diffDays < 7) return `${diffDays} gün önce`
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
    },
    formatCount(count) {
      if (count < 1000) return count.toString()
      if (count < 1000000) return (count / 1000).toFixed(1) + 'B'
      return (count / 1000000).toFixed(1) + 'M'
    },
    getCategoryColor(category) {
      const colors = {
        'Kara': 'brown',
        'Hava': 'blue',
        'Deniz': 'cyan',
        'Teknoloji': 'purple',
        'Siber': 'orange',
        'Uzay': 'indigo'
      }
      return colors[category] || 'primary'
    },
    toggleLike() {
      this.isLiked = !this.isLiked
      this.likesCount += this.isLiked ? 1 : -1
    },
    toggleComments() {
      this.showComments = !this.showComments
    },
    sharePost() {
      // Share functionality
      if (navigator.share) {
        navigator.share({
          title: this.news.title,
          text: this.news.excerpt,
          url: window.location.href
        })
      } else {
        // Fallback copy to clipboard
        navigator.clipboard.writeText(window.location.href)
        console.log('Link kopyalandı!')
      }
    },
    bookmarkPost() {
      console.log('Post kaydedildi!')
    },
    addComment() {
      if (this.newComment.trim()) {
        this.sampleComments.unshift({
          id: Date.now(),
          author: 'Sen',
          text: this.newComment
        })
        this.commentsCount++
        this.newComment = ''
      }
    }
  }
}
</script>

<style scoped>
.news-post {
  margin-bottom: 2rem;
}

.post-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: white;
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

/* Post Header */
.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.87);
}

.post-time {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
}

/* Post Image */
.post-image-container {
  position: relative;
}

.post-image {
  width: 100%;
}

.category-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
}

/* Post Actions */
.post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Engagement Stats */
.engagement-stats {
  padding: 0 1.5rem 0.5rem;
}

.likes-count {
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.87);
}

/* Post Content */
.post-content {
  padding: 0 1.5rem 0.75rem;
}

.post-title {
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  color: rgba(0, 0, 0, 0.87);
}

.post-excerpt {
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  color: #1976d2;
  font-size: 0.8rem;
  cursor: pointer;
}

.tag:hover {
  text-decoration: underline;
}

/* Comments */
.comments-preview {
  padding: 0 1.5rem 0.75rem;
}

.comments-count {
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
}

.comments-count:hover {
  text-decoration: underline;
}

.comments-section {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem 1.5rem;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.comment-content {
  font-size: 0.85rem;
  line-height: 1.4;
  flex: 1;
}

.add-comment {
  margin-top: 0.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 0.75rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .post-header {
    padding: 0.75rem 1rem;
  }
  
  .post-actions,
  .engagement-stats,
  .post-content {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .comments-section {
    padding: 0.75rem 1rem;
  }
}
</style>