import { Document, model, Model, Schema } from 'mongoose'
import Shopify = require('shopify-api-node')

declare interface IOrder {
  customerEmail: string
  orderId: string
  shopName: string
  customerPhone: string
  productIds: string[]
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
      orderId: input.id.toString(),
      shopName,
      customerPhone: input.phone,
      productIds: input.line_items.map(
        (i) => (i.product_id && i.product_id.toString()) || '',
      ),
    }
  }
}

export const order = new Order()
