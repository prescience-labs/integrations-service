import { Request, Response } from 'express'
import Shopify from 'shopify-api-node'
import { getAccessTokenFromShop } from '../../helpers/getAccessTokenFromShop'
import { Order } from '../../../../../config/db/models/order'
import { logger } from '../../../../../config/logger'
import dataIntelSdk from '../../../../../dataIntelSdk'
import { Product } from '../../../../../config/db/models/product'
import { VENDORS } from '../../..'
import { DB } from '../../../../../config/db'

export function orderUpdateController(req: Request, res: Response) {
  const shopName = req.params.shopName
  logger.verbose('Order webhook received')
  const rawOrder: Shopify.IOrder = req.body as Shopify.IOrder
  const serializedOrder = Order.serializeFromShopify(rawOrder, shopName)

  // update the review service asynchronously... we don't care if this fails, so we don't need to elegantly handle errors beyond logging the event.

  new Promise(async (resolve, reject) => {
    const accessToken = await getAccessTokenFromShop(shopName)
    if (!accessToken) {
      return reject()
    }
    try {
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
            return dataIntelSdk
              .createProduct({
                vendorId: vendor.id,
                productId: serializedProduct.productId,
                productName: serializedProduct.title,
              })
              .catch((e) => null)
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
    } catch (e) {
      logger.error(e.message)
    }
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
}
