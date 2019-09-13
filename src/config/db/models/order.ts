import { Document, model, Model, Schema } from 'mongoose'
import Shopify = require('shopify-api-node')

declare interface IOrder {
  email: string
}

declare interface IOrderDocument extends IOrder, Document { }

export interface OrderModel extends Model<IOrderDocument> { }

export class Order {
  private _model: Model<IOrderDocument>

  constructor() {
    const schema: Schema = new Schema(
      {
        email: { type: String, required: true },
      },
      { timestamps: true },
    )

    this._model = model<IOrderDocument>('Order', schema)
  }

  public get model(): Model<IOrderDocument> {
    return this._model
  }

  public static serializeFromShopify(input: Shopify.IOrder): IOrder {

    return {
      email: input.email
    }
  }
}

export const order = new Order()
