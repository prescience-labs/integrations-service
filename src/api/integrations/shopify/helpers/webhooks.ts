/**
 * All functions in this file are run on a per-shop basis.
 */
import Axios from 'axios'
import { DB } from '../../../../config/db'
import { logger } from '../../../../config/logger'
import { settings } from '../../../../config/settings'
import { getAccessTokenFromShop } from './getAccessTokenFromShop'
import Shopify, {
  ICreateWebhook,
  WebhookTopic,
  IWebhook,
} from 'shopify-api-node'

/**
 * topic must be one of the available topics from
 * https://help.shopify.com/en/api/reference/events/webhook
 */
export const createWebhook = async (
  shop: string,
  topic: WebhookTopic = 'orders/create',
  accessToken?: string,
) => {
  try {
    console.log('shop!!', shop)
    if (!accessToken) {
      accessToken = await getAccessTokenFromShop(shop)
    }
    const store = new Shopify({
      accessToken: accessToken as string,
      shopName: shop,
    })

    const webhook: ICreateWebhook = {
      topic,
      address: `${settings.baseUrl}/integrations/shopify/webhook`,
      format: 'json',
    }
    logger.info('POST /webhooks.json')
    const response: IWebhook = await store.webhook.create(webhook)
    logger.info('response', response)
    return await DB.Models.ShopifyWebhook.findOneAndUpdate(
      { shop: shop },
      {
        shop,
        address: response.address,
        topic: response.topic,
        shopifyCreatedAt: response.created_at,
        shopifyUpdatedAt: response.updated_at,
        format: response.format,
      },
      { upsert: true },
    )
  } catch (e) {
    logger.error('error', e)
    throw e
  }
}

export const getActiveWebhooks = async (shop: string) => {}
