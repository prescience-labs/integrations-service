import { DB } from '../../../../config/db'
import { logger } from '../../../../config/logger'

export const getAccessTokenFromShop = async (shop: string) => {
  const auth = await DB.Models.ShopifyAuth.findOne({ shop })
  if (!auth) {
    logger.error(`${shop} not found`)
    throw Error(`${shop} not found`)
  }
  return auth.accessToken
}
