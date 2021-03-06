import { ICreateWebhook } from 'shopify-api-node'
import OrderWebhooks from './Order/definitions'
import ProductWebhooks from './Product/definitions'
import UninstallWebhooks from './Uninstall/definitions'
import Shopify = require('shopify-api-node')
import { getAccessTokenFromShop } from '../helpers/getAccessTokenFromShop'
import { logger } from '../../../../config/logger'
import { DB } from '../../../../config/db'

export class ShopifyWebhookManager {
  private webhooks: ICreateWebhook[]
  private shop: string
  constructor(shop: string) {
    this.webhooks = [
      ...OrderWebhooks(shop),
      ...ProductWebhooks(shop),
      ...UninstallWebhooks(shop),
    ]
    this.shop = shop
  }
  private async getStore() {
    const accessToken = await getAccessTokenFromShop(this.shop)
    return new Shopify({
      accessToken: accessToken as string,
      shopName: this.shop,
    })
  }
  async init() {
    const store = await this.getStore()
    this.webhooks.map(async (webhook) => {
      console.log(webhook)
      try {
        const response: Shopify.IWebhook = await store.webhook.create(webhook)
        await DB.Models.ShopifyWebhook.findOneAndUpdate(
          { shop: this.shop, topic: webhook.topic },
          {
            shop: this.shop,
            address: response.address,
            topic: response.topic,
            shopifyCreatedAt: response.created_at,
            shopifyUpdatedAt: response.updated_at,
            format: response.format,
          },
          { upsert: true },
        )
        logger.info(`webhook ${webhook.topic} created`)
      } catch (e) {
        console.trace(e)
        logger.error(`error creating webhook: ${webhook.topic} `, e)
      }
    })
  }
}
