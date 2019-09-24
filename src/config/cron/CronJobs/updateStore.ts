import { CronJob } from 'cron'
import { updateStore } from '../../../api/integrations/shopify/initialize'
import { DB } from '../../db'
import { IShopifyAuth } from '../../db/models/shopifyAuth'
import { getAccessTokenFromShop } from '../../../api/integrations/shopify/helpers/getAccessTokenFromShop'
import { logger } from '../../logger'

export default () => [
  new CronJob('0 */5 * * * *', () => {
    try {
      DB.Models.ShopifyAuth.find({}, (err: any, res: IShopifyAuth[]) => {
        res.forEach(async (a) => {
          const shopName = await a.shop
          const accessToken =
            (await a.accessToken) || (await getAccessTokenFromShop(shopName))
          if (!shopName || !accessToken) {
            return logger.error(
              `Error updating shop with name:\n${a.shop}\nand accessToken\n${a.accessToken}`,
            )
          }
          try {
            logger.info(`Updating shop: ${shopName}`)
            updateStore({ accessToken, shopName })
          } catch (e) {
            logger.error(e.message)
          }
        })
      })
    } catch (e) {
      stop()
    }
  }),
]
