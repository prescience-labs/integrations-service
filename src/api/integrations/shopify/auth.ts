import { v4 as uuid4 } from 'uuid'
import Axios from 'axios'
import { Request, Response, Router } from 'express'
import { DB } from '../../../config/db'
import { logger } from '../../../config/logger'
import { settings } from '../../../config/settings'
import { updateStore, initialize, createRecurringCharge } from './initialize'
import dataIntelSdk from '../../../dataIntelSdk'
import { VENDORS } from '..'
import Shopify = require('shopify-api-node')
import AuthServiceSdk from '../../../dataIntelSdk/authService'
import { ShopifyPlan } from '../../../config/db/models/shopifyStore'

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

    await DB.Models.ShopifyStore.findOneAndUpdate(
      { shop },
      {
        shop,
        nonce,
      },
      { upsert: true },
    )

    res.redirect(shopifyRedirect)
  } catch (e) {
    logger.error(<Error>e)
  }
})

router.get('/redirect', async (req: Request, res: Response) => {
  const authorizationCode: string = req.query.code
  const nonce: string = req.query.state
  const shop: string = req.query.shop

  try {
    const shopifyStoreFromDb = await DB.Models.ShopifyStore.findOneAndUpdate(
      { shop, nonce },
      { authorizationCode },
    )

    if (shopifyStoreFromDb == null) {
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

    const result: IAccessTokenResponse = await Axios.post(
      authTokenUrl,
      authTokenPostData,
    )

    const { access_token: accessToken, scope } = result.data
    const shopify = new Shopify({ accessToken, shopName: shop })
    const shopifyStore = await shopify.shop.get()
    await shopifyStoreFromDb.updateOne({
      accessToken,
      scope,
      meta: result.data,
      shopifyPlan: shopifyStore.plan_name,
    })

    updateStore({ accessToken, shopName: shop })

    try {
      dataIntelSdk
        .createVendor({
          integrationId: shop,
          name: shopifyStore.name,
          integrationType: VENDORS.shopify,
        })
        .then((r) => logger.info('successfully added vendor to review service'))
        .catch((e) => console.trace(e.message))
    } catch (e) {
      console.trace(e.message)
    }

    const token = await AuthServiceSdk.forceLogIn({ email: shopifyStore.email })
    const redirectUrl = `https://app.dataintel.ai/auth/callback?token=${token}`
    if (!shopifyStoreFromDb.initialized) {
      try {
        initialize({ shopName: shop, accessToken })
      } catch (e) {
        console.trace(e.message)
      }
      try {
        const chargeResponse = await createRecurringCharge({
          shopName: shop,
          accessToken,
          returnUrl: redirectUrl,
        })

        await shopifyStoreFromDb.update({ charge: chargeResponse })

        res.redirect(
          shopifyStore.plan_name === ShopifyPlan.affiliate
            ? redirectUrl
            : chargeResponse.confirmation_url,
        )
      } catch (e) {
        console.trace(e.message)
      }
    }

    return res.redirect(redirectUrl)
  } catch (e) {
    console.trace(e.message)
    logger.error(<Error>e.message)
  } finally {
    res.sendStatus(500)
  }
})

router.get('/', (req: Request, res: Response) => {
  res.json({
    loc: '/integrations/shopify/oauth',
  })
})

export { router }
