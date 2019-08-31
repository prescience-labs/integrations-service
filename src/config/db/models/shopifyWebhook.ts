import { Document, model, Model, Schema } from 'mongoose'

declare interface IShopifyWebhook extends Document {
  shop: string,
  shopifyId: number
  address: string
  topic: string
  shopifyCreatedAt: string,
  shopifyUpdatedAt: string,
  format: string,
  apiVersion: string,
}

export interface ShopifyWebhookModel extends Model<IShopifyWebhook> {}

export class ShopifyWebhook {
  private _model: Model<IShopifyWebhook>

  constructor() {
    const schema: Schema = new Schema(
      {
        shop: { type: String, required: true, unique: true },
        shopifyId: { type: String, required: true },
        topic: { type: String, required: true },
        shopifyCreatedAt: { type: String },
        shopifyUpdatedAt: { type: String },
        address: { type: String },
        format: { type: String },
        apiVersion: { type: String },
      },
      { timestamps: true },
    )

    this._model = model<IShopifyWebhook>('ShopifyWebhook', schema)
  }

  public get model(): Model<IShopifyWebhook> {
    return this._model
  }
}
