import { Request, Response } from 'express'
import { DB } from '../../../../../config/db'
import { IShop } from 'shopify-api-node'

export async function shopUpdateRouter(req: Request, res: Response) {
  const shopName = req.params.shopName
  const store: IShop = req.body as IShop
  const shopAuth = await DB.Models.ShopifyStore.findOneAndUpdate(
    { shop: shopName },
    { planName: store.plan_name },
  )
  if (shopAuth !== null) {
    shopAuth.initialized = false
    shopAuth.save()
  }
  res.sendStatus(200)
}
