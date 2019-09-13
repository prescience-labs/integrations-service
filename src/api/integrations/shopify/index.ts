import { Request, Response, Router } from 'express'
import { router as oauthRouter } from './oauth'
import Shopify = require('shopify-api-node')
import { getAccessTokenFromShop } from './helpers/getAccessTokenFromShop'

const router: Router = Router()

router.use('/oauth', oauthRouter)

router.post('/webhook', (req, res) => {
  console.log('webhook!!', req.body)
  const order: Shopify.IOrder = req.body as Shopify.IOrder
})

router.get('/', async (req: Request, res: Response) => {
  res.json({
    loc: '/integrations/shopify',
  })
})

export { router }
