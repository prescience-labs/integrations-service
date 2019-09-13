import Shopify from 'shopify-api-node'
import { DB } from '../../../config/db'
import { Order } from '../../../config/db/models/order'
import { Product } from '../../../config/db/models/product'
import { logger } from '../../../config/logger'

export interface IInitializeStore {
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
  logger.info('updating products')
  products.map(async product => {
    const updatedProduct = await DB.Models.Product.create(Product.serializeFromShopify(product, params.shopName))
  })
}

export const refreshOrders = async (params: IInitializeStore) => {
  const orders = await getStore(params).order.list()
  logger.info('updating orders')
  orders.map(order => {
    DB.Models.Order.findOneAndUpdate({ orderId: order.id }, Order.serializeFromShopify(order, params.shopName))
  })

}

const getStore = ({ accessToken, shopName }: IInitializeStore) => {
  return new Shopify({ accessToken, shopName });
}
