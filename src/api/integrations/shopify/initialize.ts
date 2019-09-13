import Shopify from 'shopify-api-node'
import { DB } from '../../../config/db'
import { Order } from '../../../config/db/models/order'
import { Product } from '../../../config/db/models/product'

export interface IInitializeStore {
  accessToken: string,
  shopName: string
}

export const updateStore = (params: IInitializeStore) => {
  refreshOrders(params)
  refreshProducts(params)
}

export const refreshProducts = async (params: IInitializeStore) => {
  const products = await getStore(params).product.list()
  products.map(async product => {
    DB.Models.Product.findOneAndUpdate({ productId: product.id, shopName: params.shopName }, Product.serializeFromShopify(product, params.shopName), { upsert: true }).exec()
  })
}

export const refreshOrders = async (params: IInitializeStore) => {
  const orders = await getStore(params).order.list()
  orders.map(order => {
    DB.Models.Order.findOneAndUpdate({ orderId: order.id, shopName: params.shopName }, Order.serializeFromShopify(order, params.shopName), { upsert: true }).exec()
  })

}

const getStore = ({ accessToken, shopName }: IInitializeStore) => {
  return new Shopify({ accessToken, shopName });
}
