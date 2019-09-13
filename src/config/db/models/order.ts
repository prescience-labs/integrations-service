import { Document, model, Model, Schema } from 'mongoose'
import Shopify = require('shopify-api-node')

declare interface IOrder {
  email: string,
  orderId: number,
  shopName: string,
}

declare interface IOrderDocument extends IOrder, Document { }

export interface OrderModel extends Model<IOrderDocument> { }

export class Order {
  private _model: Model<IOrderDocument>

  constructor() {
    const schema: Schema = new Schema(
      {
        email: { type: String, required: true },
        orderId: { type: String, },
        shopName: { type: String }
      },
      { timestamps: true },
    )

    this._model = model<IOrderDocument>('Order', schema)
  }

  public get model(): Model<IOrderDocument> {
    return this._model
  }

  public static serializeFromShopify(input: Shopify.IOrder, shopName: string): IOrder {

    return {
      email: input.email,
      orderId: input.id,
      shopName,
    }
  }
}

export const order = new Order()
