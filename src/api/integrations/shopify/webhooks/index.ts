import { Router, Response, Request } from "express";
import Shopify = require("shopify-api-node");
import { settings } from "../../../../config/settings";

export enum WebhookAddresses {
  order = '/order',
  product = '/product'
}

export const getFullyQualifiedWebhookAddress = (webhook: keyof typeof WebhookAddresses) => {
  return `${settings.baseUrl}/integrations/shopify/webhooks/${WebhookAddresses[webhook]}`
}

const router = Router()

router.post('/order', (req: Request, res: Response) => {
  console.log('webhook!!', req.body)
  const order: Shopify.IOrder = req.body as Shopify.IOrder
})

router.post('/product', (req: Request, res: Response) => {

})

router.get('/', (req: Request, res: Response) => {
  res.json({
    loc: '/integrations/shopify/webhooks',
  })
})

export { router }