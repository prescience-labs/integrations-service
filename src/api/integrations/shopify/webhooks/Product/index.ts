import { ICreateWebhook } from "shopify-api-node";
import { getFullyQualifiedWebhookAddress } from "..";

export default (shopName: string) => [{
  topic: 'products/update',
  address: getFullyQualifiedWebhookAddress('product', shopName),
  format: 'json'
}] as ICreateWebhook[]