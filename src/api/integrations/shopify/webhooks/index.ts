import { Router, Response } from 'express'
import { settings } from '../../../../config/settings'
import { orderUpdateController } from './Order/controller'
import { productUpdateController } from './Product/controller'

export enum WebhookAddresses {
  order = 'order',
  product = 'product',
}

export const getFullyQualifiedWebhookAddress = (
  webhook: keyof typeof WebhookAddresses,
  shopName: string,
) => {
  return `${settings.baseUrl}/integrations/shopify/webhook/${WebhookAddresses[webhook]}/${shopName}`
}

const router = Router()

router.post('/order/:shopName', orderUpdateController)

router.post('/product/:shopName', productUpdateController)

router.get('/', (_, res: Response) => {
  res.json({
    loc: '/integrations/shopify/webhooks',
  })
})

export { router }
