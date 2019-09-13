import { ICreateWebhook } from "shopify-api-node";
import OrderWebhooks from './Order'
import ProductWebhooks from './Product'
import Shopify = require("shopify-api-node");
import { getAccessTokenFromShop } from "../helpers/getAccessTokenFromShop";
import { logger } from "../../../../config/logger";
import { DB } from "../../../../config/db";

export class ShopifyWebhookManager {
  private webhooks: ICreateWebhook[]
  private shop: string
  constructor(shop: string) {
    this.webhooks = [...OrderWebhooks, ...ProductWebhooks]
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
    const store = await this.getStore();
    this.webhooks.map(async webhook => {
      console.log(webhook)
      try {
        const response: Shopify.IWebhook = await store.webhook.create(webhook)
        logger.info(`webhook ${webhook.topic} created`)
        await DB.Models.ShopifyWebhook.findOneAndUpdate(
          { shop: this.shop },
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
        logger.info(`webhook ${webhook.topic} saved`)
      } catch (e) {
        logger.error('error creating webhook: ', e)
      }

    })
  }
}