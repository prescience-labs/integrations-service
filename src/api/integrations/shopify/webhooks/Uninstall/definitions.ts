import { ICreateWebhook } from "shopify-api-node";
import { getFullyQualifiedWebhookAddress } from "..";

export default (shopName: string) => [{
  topic: 'app/uninstalled',
  address: getFullyQualifiedWebhookAddress('uninstall', shopName),
  format: 'json'
}] as ICreateWebhook[]