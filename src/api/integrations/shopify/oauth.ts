import { v4 as uuid4 } from 'uuid'
import Axios from 'axios'
import { Request, Response, Router } from 'express'
import { DB } from '../../../config/db'
import { logger } from '../../../config/logger'
import { settings } from '../../../config/settings'
import { ShopifyWebhookManager } from './webhooks/WebhookManager'
const router: Router = Router()

const scopesList: string[] = [
  'read_analytics',
  'read_content',
  'read_customers',
  'read_orders',
  'read_order_edits',
  'read_product_listings',
  'read_products'
]
const scopes: string = scopesList.join(',')

interface IAccessTokenResponse {
  data: {
    access_token: string
    scope: string
    expires_in: number
    associated_user_scope: string
    associated_user: any
  }
}

router.get('/start', async (req: Request, res: Response) => {
  try {
    logger.info('hello there!')
    const shop: string = req.query.shop
    const hmac: string = req.query.hmac
    const redirectUri: string = `${settings.baseUrl}/integrations/shopify/oauth/redirect`
    const nonce: string = uuid4()

    const shopifyRedirect: string = `https://${shop}/admin/oauth/authorize?client_id=${settings.integrations.shopify.apiKey}&scope=${scopes}&redirect_uri=${redirectUri}&state=${nonce}`
    logger.debug(`Redirect URI: ${shopifyRedirect}`)

    await DB.Models.ShopifyAuth.findOneAndUpdate(
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

router.get('/redirect', async (req: Request, res: Response) => {
  const authorizationCode: string = req.query.code
  const hmac: string = req.query.hmac
  const nonce: string = req.query.state
  const shop: string = req.query.shop

  try {
    const shopifyAuth = await DB.Models.ShopifyAuth.findOneAndUpdate(
      { shop, nonce },
      { authorizationCode },
    )

    if (shopifyAuth == null) {
      throw Error(
        `The shopify shop ${shop} doesn't exist in the database, or the nonce was invalid.`,
      )
    }

    const authTokenUrl: string = `https://${shop}/admin/oauth/access_token`
    const authTokenPostData: any = {
      client_id: settings.integrations.shopify.apiKey,
      client_secret: settings.integrations.shopify.apiSecretKey,
      code: authorizationCode,
    }

    logger.info(`POST ${authTokenUrl}`)
    logger.info(authTokenPostData)
    const result: IAccessTokenResponse = await Axios.post(
      authTokenUrl,
      authTokenPostData,
    )
    logger.debug('Response:')
    logger.debug(result.data)

    await shopifyAuth.updateOne({
      accessToken: result.data.access_token,
      scope: result.data.scope,
      meta: result.data,
    })
    new ShopifyWebhookManager(shop).init()
  } catch (e) {
    logger.error((<Error>e).message)
  } finally {
    res.redirect(`https://${shop}/admin/apps/data-intel`)
  }
})

router.get('/', (req: Request, res: Response) => {
  res.json({
    loc: '/integrations/shopify/oauth'
  })
})

export { router }
