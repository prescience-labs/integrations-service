import { Router } from "express";
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

router.post('/order', (req, res) => {
  console.log('webhook!!', req.body)
  const order: Shopify.IOrder = req.body as Shopify.IOrder
})

router.post('/product', (req, res) => {

})

router.get('/', (req, res) => {
  res.json({
    loc: '/integrations/shopify/webhooks',
  })
})

export { router }