import { settings } from '../../../../config/settings'

export const getShopifyUrl = (
  hostname: string,
  resource: string,
  version: string = '2019-07',
): string => {
  const apiKey: string = settings.integrations.shopify.apiKey
  const password: string = 'settings.integrations.shopify.password'

  return `https://${apiKey}:${password}@${hostname}/admin/api/${version}/${resource}.json`
}
