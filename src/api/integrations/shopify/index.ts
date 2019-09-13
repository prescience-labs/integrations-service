import { Request, Response, Router } from 'express'
import { router as oauthRouter } from './oauth'
import { router as webhookRouter } from './webhooks'
import Shopify = require('shopify-api-node')
import { getAccessTokenFromShop } from './helpers/getAccessTokenFromShop'

const router: Router = Router()

router.use('/oauth', oauthRouter)

router.use('/webhook', webhookRouter)

router.get('/', async (req: Request, res: Response) => {
  res.json({
    loc: '/integrations/shopify',
  })
})

export { router }
