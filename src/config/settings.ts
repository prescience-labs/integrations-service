require('dotenv').config()

export const settings = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  baseUrl: process.env.BASE_URL || `http://localhost:3000`,
  logLevel: process.env.LOG_LEVEL || 'debug',

  database: {
    mongoUri: process.env.MONGO_URI || '',
  },

  integrations: {
    shopify: {
      apiKey:       process.env.SHOPIFY_API_KEY || '',
      apiSecretKey: process.env.SHOPIFY_API_SECRET_KEY || '',
    },
  },
}
