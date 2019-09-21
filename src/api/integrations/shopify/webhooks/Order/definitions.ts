import { ICreateWebhook } from "shopify-api-node";
import { getFullyQualifiedWebhookAddress } from "..";

export default (shopName: string) => [{
  topic: 'orders/updated',
  address: getFullyQualifiedWebhookAddress('order', shopName),
  format: 'json',
}] as ICreateWebhook[]

