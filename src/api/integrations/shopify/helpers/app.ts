import { settings } from '../../../../config/settings'

export const getAppUrl = (shopName: string) => {
  return `https://${shopName}/admin/apps/${settings.integrations.shopify.apiKey}`
}
