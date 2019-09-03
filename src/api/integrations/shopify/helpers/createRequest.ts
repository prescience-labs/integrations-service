import Axios, { AxiosInstance } from 'axios'

export const config = (
  method: 'get' | 'post' | 'put',
  shop: string,
  version: string = '2019-07',
  accessToken?: string,
): AxiosInstance => {
  return Axios.create({
    baseURL: `https://${shop}/admin/api/${version}`,
    method,
    headers: {
      'X-Shopify-Access-Token': accessToken,
    },
  })
}
