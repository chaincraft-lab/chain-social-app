export default {
  actions: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    update: 'Update',
    close: 'Close',
    submit: 'Submit',
    loading: 'Loading...',
    loadMore: 'Load More'
  },
  sorting: {
    newest: 'Newest',
    oldest: 'Oldest',
    titleAZ: 'Title (A-Z)',
    popular: 'Most Popular'
  },
  messages: {
    success: 'Operation successful',
    error: 'An error occurred',
    noData: 'No data found',
    backToHome: 'Back to Home'
  },
  shareOn: 'Share on {platform}',
  news: 'News',
  popular: 'Popular',
  popularNews: 'Popular News',
  readNews: 'Read News',
  widgets: {
    cryptoMarket: {
      title: 'Crypto Market',
      loading: 'Loading market data...',
      error: 'Failed to load market data',
      emptyState: 'Loading market data...'
    },
    market: {
      title: 'Markets & Forex',
      loading: 'Loading ECB rates...',
      majorCurrencies: 'Major Currencies',
      marketIndicators: 'Market Indicators',
      gold: 'Gold (Oz)',
      silver: 'Silver (Oz)',
      oil: 'Oil/TRY',
      dollarIndex: 'Dollar Index',
      volatility: 'Volatility',
      riskScore: 'Risk Score',
      lastUpdate: 'Last update',
      refresh: 'Refresh',
      currencies: {
        usd: 'US Dollar',
        eur: 'Euro',
        gbp: 'British Pound',
        jpy: 'Japanese Yen'
      },
      risk: {
        low: 'LOW',
        medium: 'MEDIUM',
        high: 'HIGH'
      },
      errors: {
        fetchFailed: 'Failed to fetch exchange rates',
        invalidFormat: 'API response not in expected format',
        general: 'An error occurred'
      }
    }
  },
  time: {
    now: 'Now',
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: '{count} days ago',
    hoursAgo: '{count} hours ago',
    minutesAgo: '{count} minutes ago'
  },
  ui: {
    categories: 'Categories',
    categoriesLoading: 'Loading categories...',
    searchCategory: 'Search category...',
    allCategories: 'All Categories',
    refresh: 'Refresh',
    tryAgain: 'Try Again',
    search: 'Search',
    searchResults: 'Search Results',
    searchPlaceholder: 'Search news...',
    searchDescription: 'Enter the keyword you want to search above.',
    searchLoading: 'Loading search results...',
    searchError: 'Search Error',
    searchErrorMessage: 'An error occurred during search',
    allSearchResults: 'All search results displayed',
    article: 'Article',
    articleContent: 'Article content',
    articleContentLoading: 'Loading article content...',
    relatedNews: 'Related News',
    newArticles: 'Load more articles',
    endOfPage: 'Load new data when approaching 200px to end of page',
    upload: 'Loading...',
    uploadPhoto: 'Save Photo',
    uploadingPhoto: 'Uploading...',
    newPassword: 'New Password',
    newPasswordPlaceholder: 'Enter your new password',
    newPasswordRepeat: 'Repeat New Password',
    newPasswordRepeatPlaceholder: 'Re-enter your new password',
    popularNews: 'Popular News',
    latestNews: 'Latest News',
    allArticlesLoaded: 'All articles loaded',
    newsCount: '{count} news',
    newest: 'Newest',
    oldest: 'Oldest',
    sortBy: 'Category',
    sortByCategory: 'By Category',
    filterBy: 'Category',
    resultsFound: '{count} news found'
  },
  states: {
    noArticles: 'No articles yet',
    noArticlesInTag: 'No articles with this tag yet.',
    allTagNews: 'You have viewed all news in this tag',
    noTagNews: 'No news yet',
    noTagNewsMessage: 'No news in this tag yet',
    noLikedNews: 'No liked news yet',
    noLikedNewsDescription: 'Start liking news to see them here.',
    exploreNews: 'Explore News',
    removeLikeConfirm: 'Are you sure you want to remove the like from this news?',
    noBookmarks: 'No saved news yet',
    noBookmarksDescription: 'Start saving news to find them here later.',
    removeBookmarkConfirm: 'Are you sure you want to remove this news from your saved items?',
    removeSelectedBookmarks: 'Are you sure you want to remove {count} selected news from your saved items?',
    noSubCategories: 'No subcategories found',
    noCategories: 'No categories yet',
    noPopularNews: 'No popular news yet',
    noFeaturedStories: 'No featured stories found'
  },
  likes: {
    liked: 'Article liked!',
    unliked: 'Like removed!'
  },
  bookmarks: {
    saved: 'Article saved!',
    removed: 'Bookmark removed!'
  },
  profile: {
    likesDescription: 'Start liking and saving news',
    newsletterDescription: 'Receive emails for new news and updates',
    newsletter: 'Newsletter',
    newsletterWeekly: 'Receive weekly summary and exclusive content',
    bio: 'Following technology and defense industry news.',
    location: 'Ankara, Turkey',
    accountDeletion: 'Your liked and saved news will be lost',
    reregistration: 'You will need to register again with this email address',
    pageRefresh: 'Refresh page - user-specific data will come from backend'
  },
  languages: {
    turkish: 'Türkçe',
    english: 'English'
  },
  comments: {
    turkishDefenseCompanies: 'Turkey\'s main defense industry companies',
    loadMoreArticles: 'Load more articles',
    pageScroll: 'Load new data when approaching 200px to end of page',
    articleDetails: 'Real API call - fetch article details',
    relatedArticles: 'Fetch related articles',
    getTagArticles: 'Then fetch articles belonging to that tag',
    responseFormat: 'Handle new response format and convert search results to news format'
  }
}