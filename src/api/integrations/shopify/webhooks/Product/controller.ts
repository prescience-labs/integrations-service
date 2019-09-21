import { Request, Response } from 'express'
import Shopify from 'shopify-api-node'
import { logger } from '../../../../../config/logger'
import { Product } from '../../../../../config/db/models/product'
import { VENDORS } from '../../..'
import dataIntelSdk from '../../../../../dataIntelSdk'
import { DB } from '../../../../../config/db'

export function productUpdateController(req: Request, res: Response) {
  logger.debug('product webhook received')
  const shopName = req.params.shopName
  const rawProduct = req.body as Shopify.IProduct
  const serializedProduct = Product.serializeFromShopify(rawProduct, shopName)
  DB.Models.Product.findOneAndUpdate(
    { productId: rawProduct.id, shopName },
    serializedProduct,
    { upsert: true },
  )
  new Promise(async (resolve, reject) => {
    const vendor = await dataIntelSdk.getVendor({
      vendorId: shopName,
      vendorType: VENDORS.shopify,
    })

    dataIntelSdk
      .createProduct({
        vendorId: vendor.id,
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
    return resolve()
  }).catch((e) => logger.error(e.message))

  logger.info('updated review service')
  res.sendStatus(200)
}
