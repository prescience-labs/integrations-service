export const settings = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,

  database: {
    mongoUri: process.env.MONGO_URI,
  },
}
