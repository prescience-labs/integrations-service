import { CronJob } from 'cron'
import { updateStore, IInitializeStore } from '../../../api/integrations/shopify/initialize'
import { DB } from '../../db'
import { IShopifyAuth } from '../../db/models/shopifyAuth'
import { getAccessTokenFromShop } from '../../../api/integrations/shopify/helpers/getAccessTokenFromShop'

export default () => [new CronJob('0 */5 * * * *', () => {
  try {
    DB.Models.ShopifyAuth.find({}, (err: any, res: IShopifyAuth[]) => {
      res.map(async a => {
        let accessToken = a.accessToken || await getAccessTokenFromShop(a.shop) || ''
        updateStore({ accessToken, shopName: a.shop })
      })
    })
  } catch (e) {
    stop()
  }
})]