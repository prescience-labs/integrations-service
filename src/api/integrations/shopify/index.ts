import { Request, Response, Router } from 'express'
import { router as oauthRouter } from './oauth'
import { router as webhookRouter } from './webhooks'
import Shopify = require('shopify-api-node')
import { getAccessTokenFromShop } from './helpers/getAccessTokenFromShop'
import { Integration } from '../'
import { DB } from '../../../config/db'
import { IShopifyAuth } from '../../../config/db/models/shopifyAuth'
import updateStore from '../../../config/cron/CronJobs/updateStore'
import { initializeShopifyCron } from '../../../config/cron/initializeCron'
import { logger } from '../../../config/logger'

const router: Router = Router()

export class ShopifyIntegration implements Integration {
  initialize() {
    initializeShopifyCron()

    DB.Models.ShopifyAuth.find({}, (err: any, res: IShopifyAuth[]) => {
      res.map(async a => {
        let accessToken = a.accessToken || await getAccessTokenFromShop(a.shop) || ''
      })
    })
  }
}

router.use('/oauth', oauthRouter)

router.use('/webhook', webhookRouter)

router.get('/', async (req: Request, res: Response) => {
  res.json({
    loc: '/integrations/shopify',
  })
})

export { router }
