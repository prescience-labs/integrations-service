import { ICreateWebhook } from "shopify-api-node";
import { getFullyQualifiedWebhookAddress } from "..";

export default [{
  topic: 'orders/updated',
  address: getFullyQualifiedWebhookAddress('order'),
  format: 'json',
}] as ICreateWebhook[]

