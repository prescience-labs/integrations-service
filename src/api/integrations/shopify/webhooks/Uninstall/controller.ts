import { Request, Response } from 'express'
import { logger } from '../../../../../config/logger'
import { DB } from '../../../../../config/db'

export async function appUninstallController(req: Request, res: Response) {
  logger.debug('app uninstall webhook received')
  const shopName = req.params.shopName
  const shopAuth = await DB.Models.ShopifyAuth.findOneAndUpdate(
    { shop: shopName },
    { initialized: false },
  )
  if (shopAuth !== null) {
    shopAuth.initialized = false
    shopAuth.save()
  }
  res.sendStatus(200)
}
