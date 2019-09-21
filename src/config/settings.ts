require('dotenv').config()

const _settings = () => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  if (!process.env.REVIEW_SERVICE_BASE_URL && !isDevelopment) {
    throw new Error('Review Service Base Url not configured')
  }
  return {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    baseUrl: process.env.BASE_URL || `http://localhost:3000`,
    logLevel: process.env.LOG_LEVEL || 'debug',
    reviewServiceBaseUrl: process.env.REVIEW_SERVICE_BASE_URL,
    database: {
      mongoUri: process.env.MONGO_URI || '',
    },

    integrations: {
      shopify: {
        apiKey: process.env.SHOPIFY_API_KEY || '',
        apiSecretKey: process.env.SHOPIFY_API_SECRET_KEY || '',
      },
    },
  }
}

export const settings = _settings()
