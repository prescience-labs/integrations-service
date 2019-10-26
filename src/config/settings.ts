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
    authServiceBaseUrl: process.env.AUTH_SERVICE_BASE_URL,
    authClientId: process.env.AUTH_CLIENT_ID,
    authClientSecret: process.env.AUTH_CLIENT_SECRET,
    database: {
      mongoUri: process.env.MONGO_URI || '',
    },
    authService: {
      url: process.env.AUTH_SERVICE_BASE_URL,
      secretKey: process.env.AUTH_SERVICE_SECRET_KEY,
      clientId: process.env.AUTH_SERVICE_CLIENT_ID,
    },
    integrations: {
      shopify: {
        apiKey: process.env.SHOPIFY_API_KEY || '',
        apiSecretKey: process.env.SHOPIFY_API_SECRET_KEY || '',
        staticFileUrl: process.env.STATIC_FILE_URL
      },
    },
  }
}

export const settings = _settings()
