import { Document, model, Model, Schema } from 'mongoose'
import Shopify = require('shopify-api-node')

declare interface IOrder {
  customerEmail: string
  orderId: number
  shopName: string
  customerPhone: string
  productIds: string[] | number[]
}

declare interface IOrderDocument extends IOrder, Document {}

export interface OrderModel extends Model<IOrderDocument> {}

export class Order {
  private _model: Model<IOrderDocument>

  constructor() {
    const schema: Schema = new Schema(
      {
        email: { type: String },
        orderId: { type: String },
        shopName: { type: String },
      },
      { timestamps: true },
    )

    this._model = model<IOrderDocument>('Order', schema)
  }

  public get model(): Model<IOrderDocument> {
    return this._model
  }

  public static serializeFromShopify(
    input: Shopify.IOrder,
    shopName: string,
  ): IOrder {
    return {
      customerEmail: input.email,
      orderId: input.id,
      shopName,
      customerPhone: input.phone,
      productIds: input.line_items.map((i) => i.id),
    }
  }
}

export const order = new Order()
