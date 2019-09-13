import { Document, model, Model, Schema } from 'mongoose'
import Shopify = require('shopify-api-node')

declare interface IProduct {
  shopName: string
  title: string,
  image?: string,
  productId: number
}

declare interface IProductDocument extends IProduct, Document { }

export interface ProductModel extends Model<IProductDocument> { }

export class Product {
  private _model: Model<IProductDocument>

  constructor() {
    const schema: Schema = new Schema(
      {
        title: { type: String, required: true },
        image: { type: String, required: false },
        shopName: { type: String, required: true },
        productId: { type: String, required: true },
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
      title: input.title,
      image: input.image && input.image.src,
      shopName,
      productId: input.id
    }
  }
}

export const product = new Product()
