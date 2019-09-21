import { Router, Response, Request } from 'express'
import Shopify = require('shopify-api-node')
import { settings } from '../../../../config/settings'
import { logger } from '../../../../config/logger'
import { DB } from '../../../../config/db'
import { Product } from '../../../../config/db/models/product'
import { Order } from '../../../../config/db/models/order'
import dataIntelSdk from '../../dataIntelSdk'
import { VENDORS } from '../..'
import { getAccessTokenFromShop } from '../helpers/getAccessTokenFromShop'

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
  logger.debug('Order webhook received')
  const rawOrder: Shopify.IOrder = req.body as Shopify.IOrder
  const serializedOrder = Order.serializeFromShopify(rawOrder, shopName)

  // update the review service asynchronously... we don't care if this fails, so we don't need to elegantly handle errors beyond logging the event.

  new Promise(async (resolve, reject) => {
    const accessToken = await getAccessTokenFromShop(shopName)
    if (!accessToken) {
      return reject()
    }

    //TODO: Upsert a product

    const store = new Shopify({
      accessToken: accessToken,
      shopName,
    })

    const vendor = await dataIntelSdk.getVendor({
      vendorId: shopName,
      vendorType: VENDORS.shopify,
    })

    const products = rawOrder.line_items
      .map((i) => i.product_id)
      .map(async (item) => {
        if (item) {
          const product = await store.product.get(item)
          const serializedProduct = Product.serializeFromShopify(
            product,
            shopName,
          )
          dataIntelSdk.createProduct({
            vendorId: vendor.id,
            productId: serializedProduct.productId,
            productName: serializedProduct.title,
          })
        }
        return null
      })

    // wait until all the products have been created
    await Promise.all(products)

    // finally, make the call to the review service to create the order
    dataIntelSdk
      .createOrder({
        vendorTransactionId: serializedOrder.orderId,
        customerEmail: serializedOrder.customerEmail,
        vendorIntegrationId: shopName,
        customerPhone: serializedOrder.customerPhone,
        vendorIntegrationType: VENDORS.shopify,
        vendorProductIds: serializedOrder.productIds,
      })
      .catch((e) => {
        logger.error(
          (e &&
            e.response &&
            e.response.data &&
            JSON.stringify(e.response.data)) ||
            'Error updating the review service with an order',
        )
      })

    logger.info('updated review service')
  }).catch((e) => {
    logger.error('Something went wrong while updating the review service')
  })

  DB.Models.Order.findOneAndUpdate(
    { orderId: rawOrder.id, shopName },
    serializedOrder,
    { upsert: true },
  )
  res.sendStatus(200)
})

router.post('/product/:shopName', (req: Request, res: Response) => {
  logger.debug('product webhook received')
  const shopName = req.params.shopName
  const rawProduct = req.body as Shopify.IProduct
  const serializedProduct = Product.serializeFromShopify(rawProduct, shopName)
  DB.Models.Product.findOneAndUpdate(
    { productId: rawProduct.id, shopName },
    serializedProduct,
    { upsert: true },
  )
  dataIntelSdk
    .getVendor({ vendorId: shopName, vendorType: VENDORS.shopify })
    .then((data) => {
      dataIntelSdk
        .createProduct({
          vendorId: data.id,
          productId: serializedProduct.productId,
          productName: serializedProduct.title,
        })
        .catch((e) => {
          logger.error(
            (e &&
              e.response &&
              e.response.data &&
              JSON.stringify(e.response.data)) ||
              'Error updating the review service with a product',
          )
        })
    })
    .catch((e) => logger.error(e.message))

  logger.info('updated review service')
  res.sendStatus(200)
})

router.get('/', (req: Request, res: Response) => {
  res.json({
    loc: '/integrations/shopify/webhooks',
  })
})

export { router }
