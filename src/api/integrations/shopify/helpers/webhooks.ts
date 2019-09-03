/**
 * All functions in this file are run on a per-shop basis.
 */
import Axios from 'axios'
import { DB } from '../../../../config/db'
import { logger } from '../../../../config/logger'
import { settings } from '../../../../config/settings'
import { config } from './createRequest'
import { getAccessTokenFromShop } from './getAccessTokenFromShop'

interface ICreateWebhookResponse {
  webhook: {
    id: number
    address: string
    topic: string
    created_at: string
    updated_at: string
    format: string
    fields: string[],
    metafield_namespaces: string[],
    api_version: string[],
    errors?: any
  }
}

/**
 * topic must be one of the available topics from
 * https://help.shopify.com/en/api/reference/events/webhook
 */
export const createWebhook = async (shop: string, topic: string, accessToken?: string) => {
  try {
    if (!accessToken) {
      accessToken = await getAccessTokenFromShop(shop)
    }

    const request = config('post', shop, '2019-07', accessToken)
    const requestBody = {
      webhook: {
        topic,
        address: `${settings.baseUrl}/integrations/shopify/webhook`,
        format: 'json',
      }
    }
    logger.info('POST /webhooks.json')
    logger.info(requestBody)
    const response: ICreateWebhookResponse = await request.post('/webhooks.json', requestBody)

    const webhook = await DB.Models.ShopifyWebhook.findOneAndUpdate({ _id: response.webhook.id }, {
      _id: response.webhook.id,
      shop,
      address: response.webhook.address,
      topic: response.webhook.topic,
      shopifyCreatedAt: response.webhook.created_at,
      shopifyUpdatedAt: response.webhook.updated_at,
      format: response.webhook.format,
      apiVersion: response.webhook.api_version,
    }, { upsert: true })
  } catch (e) {
    logger.error(e)
    throw e
  }
}

export const getActiveWebhooks = async (shop: string) => {

}
