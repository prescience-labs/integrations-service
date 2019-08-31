import Axios, { AxiosInstance } from 'axios'

export const request = (
  method: 'get' | 'post' | 'put',
  shop: string,
  version: string = '2019-07',
  resource: string,
  accessToken?: string,
): AxiosInstance => {
  return Axios.create({
    baseURL: `https://${shop}/admin/api/${version}/${resource}.json`,
    method,
    headers: {
      'X-Shopify-Access-Token': accessToken,
    },
  })
}
