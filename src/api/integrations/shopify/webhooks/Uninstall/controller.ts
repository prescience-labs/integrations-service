import { Request, Response } from 'express'
import { logger } from '../../../../../config/logger'
import { DB } from '../../../../../config/db'

export function appUninstallController(req: Request, res: Response) {
  logger.debug('product webhook received')
  const shopName = req.params.shopName
  DB.Models.ShopifyAuth.findOneAndUpdate(
    { shopName },
    { initialized: false },
    { upsert: true }
  )
}
