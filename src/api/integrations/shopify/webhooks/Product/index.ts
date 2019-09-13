import { ICreateWebhook } from "shopify-api-node";
import { getFullyQualifiedWebhookAddress } from "..";

export default [{
  topic: 'products/update',
  address: getFullyQualifiedWebhookAddress('product'),
  format: 'json'
}] as ICreateWebhook[]