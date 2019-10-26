import { Document, model, Model, Schema } from 'mongoose'

export interface IShopifyAuth extends Document {
  shop: string
  nonce: string
  authorizationCode?: string
  accessToken?: string
  scope?: string
  meta?: any;
  initialized?: boolean
}

export interface ShopifyAuthModel extends Model<IShopifyAuth> { }

class ShopifyAuth {
  private _model: Model<IShopifyAuth>

  constructor() {
    const schema: Schema = new Schema(
      {
        shop: { type: String, required: true, unique: true },
        nonce: { type: String, required: true },
        authorizationCode: { type: String },
        accessToken: { type: String },
        scope: { type: String },
        meta: { type: Schema.Types.Mixed },
        initialized: { type: Boolean, required: false }
      },
      { timestamps: true },
    )

    this._model = model<IShopifyAuth>('ShopifyAuth', schema)
  }

  public get model(): Model<IShopifyAuth> {
    return this._model
  }
}

export const shopifyAuth = new ShopifyAuth()
