import { v4 as uuid4 } from 'uuid'
import Axios from 'axios'
import { Request, Response, Router } from 'express'
import { DB } from '../../../config/db'
import { logger } from '../../../config/logger'
import { settings } from '../../../config/settings'
import { ShopifyWebhookManager } from './webhooks/WebhookManager'
import { updateStore } from './initialize'
import dataIntelSdk from '../../../dataIntelSdk'
import { VENDORS } from '..'
import Shopify = require('shopify-api-node')

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
  'write_script_tags']
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

    logger.info(authTokenPostData)
    const result: IAccessTokenResponse = await Axios.post(
      authTokenUrl,
      authTokenPostData,
    )

    const { access_token: accessToken, scope } = result.data

    await shopifyAuth.updateOne({
      accessToken,
      scope,
      meta: result.data,
    })


    updateStore({ accessToken, shopName: shop })

    const shopify = new Shopify({ accessToken, shopName: shop })
    const shopifyStore = await shopify.shop.get()
    logger.info(shopifyStore)
    dataIntelSdk
      .createVendor({
        integrationId: shop,
        name: shopifyStore.name,
        integrationType: VENDORS.shopify,
      })
      .then((r) => logger.info('successfully added vendor to review service'))
      .catch((e) => logger.error(e.message))

    if (!shopifyAuth.initialized) {
      if (settings.integrations.shopify.staticFileUrl) {
        try {
          shopify.scriptTag.create({ src: `${settings.integrations.shopify.staticFileUrl}/index.js`, event: 'onload' })
        } catch (e) { }
      }
      new ShopifyWebhookManager(shop).init()
      try {
        await dataIntelSdk.createUser({ email: shopifyStore.email })
      } catch (e) {
      } finally {
        const token = await dataIntelSdk.forceToken({ email: shopifyStore.email })
        res.redirect(`https://app.dataintel.ai/auth/callback?token=${token}`)
      }
      shopifyAuth.initialized = true
      shopifyAuth.save()
    }

  } catch (e) {
    logger.error((<Error>e).message)
  } finally {
    res.status(500)
  }
})

router.get('/', (req: Request, res: Response) => {
  res.json({
    loc: '/integrations/shopify/oauth',
  })
})

export { router }
