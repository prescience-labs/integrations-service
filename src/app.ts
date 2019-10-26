import express = require('express')

import { router } from './api'
import { logger } from './config/logger'
import { settings } from './config/settings'
import bodyParser from 'body-parser'
import { Integration } from './api/integrations'
import { ShopifyIntegration } from './api/integrations/shopify'
import cors from 'cors'

const app: express.Application = express()

app.use(bodyParser.json())
app.use(cors())
app.use('/', router)

const integrations: Integration[] = [new ShopifyIntegration()]

integrations.map((i) => i.initialize())

app.listen(settings.port, async () => {
  logger.info(`App listening on port ${settings.port}!`)
  logger.debug(`Base URL: ${settings.baseUrl}`)
})
