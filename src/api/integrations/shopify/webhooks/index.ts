import { Router, Response, Request } from "express";
import Shopify = require("shopify-api-node");
import { settings } from "../../../../config/settings";
import { logger } from "../../../../config/logger";
import { DB } from "../../../../config/db";
import { Product } from "../../../../config/db/models/product";
import { Order } from "../../../../config/db/models/order";

export enum WebhookAddresses {
  order = '/order',
  product = '/product'
}

export const getFullyQualifiedWebhookAddress = (webhook: keyof typeof WebhookAddresses, shopName: string) => {
  return `${settings.baseUrl}/integrations/shopify/webhook${WebhookAddresses[webhook]}/${shopName}`
}

const router = Router()

router.post('/order/:shopName', (req: Request, res: Response) => {
  const shopName = req.params.shopName
  console.log('order updated', req.body)
  const order: Shopify.IOrder = req.body as Shopify.IOrder
  DB.Models.Order.findOneAndUpdate({ orderId: order.id, shopName }, Order.serializeFromShopify(order, shopName), { upsert: true })
  res.sendStatus(200)
})

router.post('/product/:shopName', (req: Request, res: Response) => {
  logger.info('product updated')
  const shopName = req.params.shopName
  const product = req.body as Shopify.IProduct
  DB.Models.Order.findOneAndUpdate({ productId: product.id, shopName }, Product.serializeFromShopify(product, shopName), { upsert: true })
  logger.info(JSON.stringify(product, null, 2))
  res.sendStatus(200)
})

router.get('/', (req: Request, res: Response) => {
  res.json({
    loc: '/integrations/shopify/webhooks',
  })
})

export { router }