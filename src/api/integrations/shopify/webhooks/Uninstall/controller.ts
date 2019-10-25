import { Request, Response } from 'express'
import { logger } from '../../../../../config/logger'
import { DB } from '../../../../../config/db'

export function appUninstallController(req: Request, res: Response) {
  logger.debug('app uninstall webhook received')
  const shopName = req.params.shopName
  DB.Models.ShopifyAuth.findOneAndUpdate(
    { shop: shopName },
    { initialized: false },
    { upsert: true }
  )
  res.sendStatus(200)
}
