import { DB } from '../../../../config/db'

export const getShopifyStoreFromDb = async ({ shop }: { shop: string }) => {
  const store = await DB.Models.ShopifyStore.findOne({ shop })
  if (store) {
    return store
  }
  throw Error(`Could not find store ${shop}`)
}
