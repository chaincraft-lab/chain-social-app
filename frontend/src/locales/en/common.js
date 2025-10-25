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
  }
}