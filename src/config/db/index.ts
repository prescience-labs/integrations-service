import { connect, connection, Connection } from 'mongoose'
import { logger } from '../logger'
import { settings } from '../settings'

import { ShopifyAuthModel, shopifyAuth } from './models/shopifyAuth'
import { ShopifyWebhookModel, shopifyWebhook } from './models/shopifyWebhook'
import { OrderModel, order } from './models/order'
import { ProductModel, product } from './models/product'

declare interface IModels {
  ShopifyAuth: ShopifyAuthModel
  ShopifyWebhook: ShopifyWebhookModel
  Order: OrderModel
  Product: ProductModel
}

export class DB {
  private static instance: DB

  private _db: Connection
  private _models: IModels

  private constructor() {
    connect(
      settings.database.mongoUri,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
    )
    this._db = connection
    this._db.on('open', this.connected)
    this._db.on('error', this.error)
    this._db.on('close', this.close)

    this._models = {
      // initialize all models
      ShopifyAuth: shopifyAuth.model,
      ShopifyWebhook: shopifyWebhook.model,
      Order: order.model,
      Product: product.model
    }
  }

  public static get Models() {
    if (!DB.instance) {
      DB.instance = new DB()
    }
    return DB.instance._models
  }

  private connected() {
    logger.info('Mongo has connected')
  }

  private error(err: any) {
    logger.error('Mongo has errored', err)
  }

  private close() {
    logger.info('Mongo has disconnected')
  }
}
