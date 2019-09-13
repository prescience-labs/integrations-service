import { Document, model, Model, Schema } from 'mongoose'
import Shopify = require('shopify-api-node')

declare interface IProduct {
  email: string
  shopName: string
  title: string
}

declare interface IProductDocument extends IProduct, Document { }

export interface ProductModel extends Model<IProductDocument> { }

export class Product {
  private _model: Model<IProductDocument>

  constructor() {
    const schema: Schema = new Schema(
      {
        email: { type: String, required: true },
      },
      { timestamps: true },
    )

    this._model = model<IProductDocument>('Product', schema)
  }

  public get model(): Model<IProductDocument> {
    return this._model
  }

  public static serializeFromShopify(input: Shopify.IProduct, shopName: string): IProduct {

    return {
      email: input.title,
      title: input.title,
      shopName,
    }
  }
}

export const product = new Product()
