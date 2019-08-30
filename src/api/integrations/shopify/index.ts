import { v4 as uuid4 } from 'uuid'
import Axios from 'axios'
import { Request, Response, Router } from 'express'
import { DB } from '../../../config/db'
import { logger } from '../../../config/logger'
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

interface IAccessTokenResponse {
  access_token: string
  scope: string
  expires_in: number
  associated_user_scope: string
  associated_user: any
}

router.get('/', async (req: Request, res: Response) => {
  res.json({
    loc: '/integrations/shopify',
  })
})

router.get('/oauth/start', async (req: Request, res: Response) => {
  try {
    const shop: string = req.query.shop
    const hmac: string = req.query.hmac
    const redirectUri: string = `${settings.baseUrl}/integrations/shopify/oauth/redirect`
    const nonce: string = uuid4()

    const shopifyRedirect: string = `https://${shop}/admin/oauth/authorize?client_id=${settings.integrations.shopify.apiKey}&scope=${scopes}&redirect_uri=${redirectUri}&state=${nonce}`

    logger.debug(`Redirect URI: ${shopifyRedirect}`)

    const auth = await DB.Models.ShopifyAuth.findOneAndUpdate(
      { shop: shop },
      {
        shop,
        nonce,
      },
      { upsert: true },
    )

    res.redirect(shopifyRedirect)
  } catch (e) {
    logger.error((<Error>e).message)
  }
})

router.get('/oauth/redirect', async (req: Request, res: Response) => {
  try {
    const authorizationCode: string = req.query.code
    const hmac: string = req.query.hmac
    const nonce: string = req.query.state
    const shop: string = req.query.shop

    const shopifyAuth = await DB.Models.ShopifyAuth.findOneAndUpdate(
      { shop, nonce },
      { authorizationCode },
    )

    const authTokenUrl: string = `https://${shop}/admin/oauth/access_token`
    const authTokenPostData: any = {
      client_id: settings.integrations.shopify.apiKey,
      client_secret: settings.integrations.shopify.apiSecretKey,
      code: authorizationCode,
    }
    logger.info(`POST ${authTokenUrl}`)
    logger.info(authTokenPostData)
    const result: IAccessTokenResponse = await Axios.post(authTokenUrl, authTokenPostData)

    const updateShopifyAuth = await DB.Models.ShopifyAuth.findOneAndUpdate(
      { shop },
      {
        accessToken: result.access_token,
        scope: result.scope,
        meta: result,
      },
    )
    res.redirect(`https://${shop}/admin`)
  } catch (e) {
    logger.error((<Error>e).message)
  }
})

export { router }
