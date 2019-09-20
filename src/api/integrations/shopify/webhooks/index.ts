import { Router, Response, Request } from 'express'
import Shopify = require('shopify-api-node')
import { settings } from '../../../../config/settings'
import { logger } from '../../../../config/logger'
import { DB } from '../../../../config/db'
import { Product } from '../../../../config/db/models/product'
import { Order, order } from '../../../../config/db/models/order'
import dataIntelSdk from '../../dataIntelSdk'
import { VENDORS } from '../..'

export enum WebhookAddresses {
  order = '/order',
  product = '/product',
}

export const getFullyQualifiedWebhookAddress = (
  webhook: keyof typeof WebhookAddresses,
  shopName: string,
) => {
  return `${settings.baseUrl}/integrations/shopify/webhook${WebhookAddresses[webhook]}/${shopName}`
}

const router = Router()

router.post('/order/:shopName', (req: Request, res: Response) => {
  const shopName = req.params.shopName
  console.log('order updated', req.body)
  const rawOrder: Shopify.IOrder = req.body as Shopify.IOrder
  const serializedOrder = Order.serializeFromShopify(rawOrder, shopName)
  dataIntelSdk.createOrder({
    customerEmail: serializedOrder.customerEmail,
    vendorIntegrationId: shopName,
    customerPhone: serializedOrder.customerPhone,
    vendorIntegrationType: VENDORS.shopify,
    vendorProductIds: serializedOrder.productIds,
  })
  DB.Models.Order.findOneAndUpdate(
    { orderId: rawOrder.id, shopName },
    serializedOrder,
    { upsert: true },
  )
  res.sendStatus(200)
})

router.post('/product/:shopName', (req: Request, res: Response) => {
  logger.info('product updated')
  const shopName = req.params.shopName
  const rawProduct = req.body as Shopify.IProduct
  const serializedProduct = Product.serializeFromShopify(rawProduct, shopName)
  DB.Models.Product.findOneAndUpdate(
    { productId: rawProduct.id, shopName },
    serializedProduct,
    { upsert: true },
  )
  dataIntelSdk.createProduct({
    vendorId: shopName,
    productId: serializedProduct.productId,
    productName: serializedProduct.title,
  })
  logger.info(JSON.stringify(rawProduct, null, 2))
  res.sendStatus(200)
})

router.get('/', (req: Request, res: Response) => {
  res.json({
    loc: '/integrations/shopify/webhooks',
  })
})

export { router }
