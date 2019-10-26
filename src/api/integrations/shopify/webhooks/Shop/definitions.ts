import { ICreateWebhook } from 'shopify-api-node'
import { getFullyQualifiedWebhookAddress } from '..'

export default (shopName: string) =>
  [
    {
      topic: 'shop/update',
      address: getFullyQualifiedWebhookAddress('shop', shopName),
      format: 'json',
    },
  ] as ICreateWebhook[]
