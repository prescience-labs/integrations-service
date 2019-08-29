import { Document, model, Model, Schema } from 'mongoose'

declare interface IShopifyAuth extends Document {
  shop: string
  timestamp: string
  hmac: string
  nonce: string
}

export interface ShopifyAuthModel extends Model<IShopifyAuth> {}

export class ShopifyAuth {
  private _model: Model<IShopifyAuth>

  constructor() {
    const schema: Schema = new Schema({
      shop: { type: String, required: true },
      timestamp: { type: String, required: true },
      hmac: { type: String, required: true },
      nonce: { type: String, required: true },
    }, { timestamps: true })

    this._model = model<IShopifyAuth>('ShopifyAuth', schema)
  }

  public get model(): Model<IShopifyAuth> {
    return this._model
  }
}
