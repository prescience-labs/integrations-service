import { connect, connection, Connection } from 'mongoose'
import { logger } from '../logger'
import { settings } from '../settings'
import { ShopifyAuth, ShopifyAuthModel } from './models/shopifyAuth'

declare interface IModels {
  ShopifyAuth: ShopifyAuthModel
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
      ShopifyAuth: new ShopifyAuth().model,
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
