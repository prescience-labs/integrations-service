const uuid4 = require('uuid/v4')
import { Request, Response, Router } from 'express'
import { DB } from '../../../config/db'
import { settings } from '../../../config/settings'

const router: Router = Router()

const scopesList: string[] = [
  'read_analytics',
  'read_content',
  'read_customers',
  'read_orders',
  'read_order_edits',
  'read_product_listings',
]
const scopes: string = scopesList.join(',')

router.get('/', async (req: Request, res: Response) => {
  res.json({
    loc: '/integrations/shopify',
  })
})

router.get('/oauth/start', async (req: Request, res: Response) => {
  try {
    const shop: string        = req.params.shop
    const timestamp: string   = req.params.timestamp
    const hmac: string        = req.params.hmac
    const redirectUri: string = `${settings.baseUrl}/integrations/shopify/oauth/redirect`
    const nonce: string       = uuid4()

    const auth = new DB.Models.ShopifyAuth({
      shop,
      timestamp,
      hmac,
      nonce,
    })

    await auth.save()

    res.redirect(`https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${settings.integrations.shopify.apiKey}&scope=${scopes}&redirect_uri=${redirectUri}&state=${nonce}`)

  } catch (e) {
    console.error((<Error>e).message)
  }
})

export { router }
