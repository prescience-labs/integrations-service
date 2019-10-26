import { Document, model, Model, Schema } from 'mongoose'
import { stringify } from 'querystring'
import { IRecurringApplicationCharge } from 'shopify-api-node'
export enum ShopifyPlan {
  enterprise = 'enterprise',
  affiliate = 'affiliate',
}

export interface IShopifyStore extends Document {
  shop: string
  nonce: string
  authorizationCode?: string
  accessToken?: string
  scope?: string
  meta?: any
  initialized?: boolean
  hasAuthorizedPayment?: boolean
  shopifyPlan?: string
  charge?: IRecurringApplicationCharge
}

export interface ShopifyStoreModel extends Model<IShopifyStore> {}

class ShopifyStore {
  private _model: Model<IShopifyStore>

  constructor() {
    const schema: Schema = new Schema(
      {
        shop: { type: String, required: true, unique: true },
        nonce: { type: String, required: true },
        authorizationCode: { type: String },
        accessToken: { type: String },
        scope: { type: String },
        meta: { type: Schema.Types.Mixed },
        initialized: { type: Boolean, required: false },
        shopifyPlan: { type: String, required: true },
        charge: { type: Schema.Types.Map, required: false },
      },
      { timestamps: true },
    )

    this._model = model<IShopifyStore>('ShopifyStore', schema)
  }

  public get model(): Model<IShopifyStore> {
    return this._model
  }
}

export const shopifyStore = new ShopifyStore()
