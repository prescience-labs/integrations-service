import { v4 as uuid4 } from 'uuid'
import Axios from 'axios'
import { Request, Response, Router } from 'express'
import { DB } from '../../../config/db'
import { logger } from '../../../config/logger'
import { settings } from '../../../config/settings'
import { ShopifyWebhookManager } from './webhooks/WebhookManager'
import { updateStore, getStore } from './initialize'
import dataIntelSdk from '../../../dataIntelSdk'
import { VENDORS } from '..'
import AuthServiceSdk from '../../../dataIntelSdk/authService'

const router: Router = Router()

const scopesList: string[] = [
  'read_analytics',
  'read_content',
  'read_customers',
  'read_orders',
  'read_order_edits',
  'read_product_listings',
  'read_products',
  'read_script_tags',
  'write_script_tags',
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
    const shop: string = req.query.shop
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
  const nonce: string = req.query.state
  const shopName: string = req.query.shop

  let token = ''

  try {
    const shopifyAuth = await DB.Models.ShopifyAuth.findOneAndUpdate(
      { shop: shopName, nonce },
      { authorizationCode },
    )

    if (shopifyAuth == null) {
      throw Error(
        `The shopify shop ${shopName} doesn't exist in the database, or the nonce was invalid.`,
      )
    }

    const authTokenUrl: string = `https://${shopName}/admin/oauth/access_token`
    const authTokenPostData: any = {
      client_id: settings.integrations.shopify.apiKey,
      client_secret: settings.integrations.shopify.apiSecretKey,
      code: authorizationCode,
    }

    logger.info(authTokenPostData)
    const result: IAccessTokenResponse = await Axios.post(
      authTokenUrl,
      authTokenPostData,
    )

    const accessToken = result.data.access_token

    await shopifyAuth.updateOne({
      accessToken: accessToken,
      scope: result.data.scope,
      meta: result.data,
    })

    new ShopifyWebhookManager(shopName).init()
    updateStore({ accessToken: result.data.access_token, shopName: shopName })
    dataIntelSdk
      .createVendor({
        integrationId: shopName,
        name: shopName,
        integrationType: VENDORS.shopify,
      })
      .then((r) => logger.info('successfully added vendor to review service'))
      .catch((e) => logger.error(e.message))
    const store = await getStore({ accessToken, shopName })
    if (settings.integrations.shopify.staticSiteUrl) {
      console.log(
        'script location!!!!!',
        settings.integrations.shopify.staticSiteUrl,
      )
      const script = await store.scriptTag.create({
        event: 'onload',
        src: settings.integrations.shopify.staticSiteUrl,
      })
      console.log(script)
    }
    const email = (await store.shop.get()).email
    try {
      AuthServiceSdk.createUser({ email })
    } finally {
      token = await AuthServiceSdk.forceLogIn({ email })
    }
  } catch (e) {
    logger.error((<Error>e).message)
  } finally {
    const redirectUrl = `http://localhost:3001/auth/callback?token=${token}`
    res.redirect(redirectUrl)
  }
})

router.get('/', (req: Request, res: Response) => {
  res.json({
    loc: '/integrations/shopify/oauth',
  })
})

export { router }
