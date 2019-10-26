import { Request, Response, Router } from 'express'
import { router as oauthRouter } from './auth'
import { router as webhookRouter } from './webhooks'
import { router as resourceRouter } from './resources'
import Shopify = require('shopify-api-node')
import { getAccessTokenFromShop } from './helpers/getAccessTokenFromShop'
import { Integration } from '../'
import { DB } from '../../../config/db'
import { IShopifyStore } from '../../../config/db/models/shopifyStore'
import { initializeShopifyCron } from '../../../config/cron/initializeCron'

const router: Router = Router()

export class ShopifyIntegration implements Integration {
  initialize() {
    initializeShopifyCron()
    DB.Models.ShopifyStore.find({}, (err: any, res: IShopifyStore[]) => {
      res.map(async a => {
        let accessToken = a.accessToken || await getAccessTokenFromShop(a.shop) || ''
      })
    })
  }
}

router.use('/oauth', oauthRouter)

router.use('/webhook', webhookRouter)

router.use('/resources', resourceRouter)

router.get('/', async (req: Request, res: Response) => {
  res.json({
    loc: '/integrations/shopify',
  })
})

export { router }
