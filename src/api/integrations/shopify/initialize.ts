import Shopify from 'shopify-api-node'
import { DB } from '../../../config/db'
import { Order } from '../../../config/db/models/order'
import { Product } from '../../../config/db/models/product'
import { settings } from '../../../config/settings'
import { logger } from '../../../config/logger'
import { ShopifyWebhookManager } from './webhooks/WebhookManager'
import dataIntelSdk from '../../../dataIntelSdk'
import { getAppUrl } from './helpers/app'

export interface IInitializeStore {
  accessToken: string
  shopName: string
  returnUrl?: string
}

export const updateStore = (params: IInitializeStore) => {
  refreshOrders(params)
  refreshProducts(params)
}

export const refreshProducts = async (params: IInitializeStore) => {
  const products = await getStore(params).product.list()
  products.map(async (product) => {
    DB.Models.Product.findOneAndUpdate(
      { productId: product.id, shopName: params.shopName },
      Product.serializeFromShopify(product, params.shopName),
      { upsert: true },
    ).exec()
  })
}

export const refreshOrders = async (params: IInitializeStore) => {
  const orders = await getStore(params).order.list()
  orders.map((order) => {
    DB.Models.Order.findOneAndUpdate(
      { orderId: order.id, shopName: params.shopName },
      Order.serializeFromShopify(order, params.shopName),
      { upsert: true },
    ).exec()
  })
}

export const getStore = ({ accessToken, shopName }: IInitializeStore) => {
  return new Shopify({ accessToken, shopName })
}

export const setInitializationStatus = async (
  shop: string,
  status: boolean,
) => {
  const shopifyStore = await DB.Models.ShopifyStore.findOne({ shop })
  if (shopifyStore) {
    shopifyStore.initialized = status
    shopifyStore.save()
    return true
  }
  throw new Error(`Could not find store ${shop}`)
}

export const createRecurringCharge = async ({
  shopName,
  accessToken,
  returnUrl,
}: IInitializeStore) => {
  const store = await getStore({ shopName, accessToken })
  const response = await store.recurringApplicationCharge.create({
    trial_days: 180,
    terms: 'Dolla Dolla for unlimited use',
    price: 70,
    name: 'Monthly subscription to data intel',
    return_url: returnUrl || getAppUrl(shopName),
  })
  return response
}

export const initialize = async ({
  accessToken,
  shopName,
}: IInitializeStore) => {
  const shopify = getStore({ accessToken, shopName })
  if (settings.integrations.shopify.staticFileUrl) {
    try {
      shopify.scriptTag.create({
        src: `${settings.integrations.shopify.staticFileUrl}/index.js`,
        event: 'onload',
      })
    } catch (e) {
      logger.error(e)
    }
  }
  new ShopifyWebhookManager(shopName).init()
  try {
    await dataIntelSdk.createUser({ email: (await shopify.shop.get()).email })
  } catch (e) {
    logger.error(e)
  }

  setInitializationStatus(shopName, true)
}
