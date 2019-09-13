import Shopify from 'shopify-api-node'
import { DB } from '../../../config/db'
import { Order } from '../../../config/db/models/order'
import { Product } from '../../../config/db/models/product'
import { logger } from '../../../config/logger'

interface IInitializeStore {
  accessToken: string,
  shopName: string
}

export const updateStore = (params: IInitializeStore) => {
  logger.info('updating store')
  refreshOrders(params)
  refreshProducts(params)
}

export const refreshProducts = async (params: IInitializeStore) => {
  const products = await getStore(params).product.list()
  products.map(async product => {
    const updatedProduct = await DB.Models.Product.findOneAndUpdate({ shopName: params.shopName, productId: product.id }, Product.serializeFromShopify(product, params.shopName))
    logger.info('product updated', JSON.stringify(updatedProduct, null, 2))
  })
}

export const refreshOrders = async (params: IInitializeStore) => {
  const orders = await getStore(params).order.list()
  orders.map(order => {
    DB.Models.Order.findOneAndUpdate({ shopName: params.shopName, orderId: order.id }, Order.serializeFromShopify(order, params.shopName))
  })

}

const getStore = ({ accessToken, shopName }: IInitializeStore) => {
  return new Shopify({ accessToken, shopName });
}
