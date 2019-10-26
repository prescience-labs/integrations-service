import { settings } from '../config/settings'
import Axios from 'axios'
import uuid = require('uuid')

interface ICreateVendorParams {
  integrationType: string
  integrationId: string | number
  name: string
}

interface ICreateProductParams {
  vendorId: string | number
  productId: number | string
  productName: string
}

interface IGetVendorIdParams {
  vendorId: string | number
  vendorType: string
}

interface IVendor {
  integrations_id: string
  integrations_type: string
  name: string
  id: string
  created_at: string
  updated_at: string
}

interface ISerializedVendor {
  integrationId: string
  integrationType: string
  name: string
  id: string
}

interface IProduct {
  id: string
}

interface ITransaction {
  id: string
}

interface ICreateOrderParams {
  customerEmail: string
  customerPhone: string
  vendorIntegrationType: string
  vendorIntegrationId: string | number
  vendorProductIds: string[] | number[]
  vendorTransactionId: string
}
interface IUpdateVendor {
  vendorId: string
  vendor: ICreateVendorParams
}
interface IAuth {
  email: string
  password?: string
}
class DataIntelSdk {
  private axios = Axios.create({})
  private reviewServiceBaseUrl: string = settings.reviewServiceBaseUrl || ''
  constructor() {
    this.axios.interceptors.request.use((config) => ({
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Basic ${settings.authClientId}:${settings.authClientSecret}`,
      },
    }))
  }
  createVendor({ integrationType, integrationId, name }: ICreateVendorParams) {
    return this.axios.post(`${this.reviewServiceBaseUrl}/vendors`, {
      name,
      integrations_type: integrationType,
      integrations_id: integrationId,
    })
  }
  createProduct({ vendorId, productId, productName }: ICreateProductParams) {
    return this.axios.post(
      `${this.reviewServiceBaseUrl}/vendors/${vendorId}/products`,
      {
        name: productName,
        vendor_product_id: productId,
      },
    )
  }
  createOrder({
    customerEmail,
    customerPhone,
    vendorIntegrationId,
    vendorIntegrationType,
    vendorProductIds,
    vendorTransactionId,
  }: ICreateOrderParams) {
    return this.axios.post(
      `${this.reviewServiceBaseUrl}/transactions/comprehensive`,
      {
        customer_email: customerEmail,
        customer_phone: customerPhone,
        vendor_integrations_type: vendorIntegrationType,
        vendor_integrations_id: vendorIntegrationId,
        vendor_product_ids: vendorProductIds,
        vendor_transaction_id: vendorTransactionId,
      },
    )
  }
  async getVendor({
    vendorType,
    vendorId,
  }: IGetVendorIdParams): Promise<ISerializedVendor> {
    const { data } = await this.axios.get(
      `${settings.reviewServiceBaseUrl}/vendors?integrations_type=${vendorType}&integrations_id=${vendorId}`,
    )
    if ((data.results as IVendor[]).length != 1) {
      throw new Error(
        'There was an error finding the vendor in the review service',
      )
    }
    const rawVendor: IVendor = data.results[0]
    return {
      id: rawVendor.id,
      integrationId: rawVendor.integrations_id,
      integrationType: rawVendor.integrations_type,
      name: rawVendor.name,
    } as ISerializedVendor
  }
  async updateVendor({ vendorId, vendor }: IUpdateVendor) {
    const { data } = await this.axios.put(
      `${settings.reviewServiceBaseUrl}/vendors/${vendorId}`,
      vendor,
    )
  }
  async createUser({ email, password = uuid.v4() }: IAuth) {
    const { data } = await this.axios.post(`${settings}`, { email, password })
  }
  async forceToken({ email }: IAuth) {
    const {
      data: { token },
    } = await this.axios.post(`${settings.authServiceBaseUrl}/token/force`, {
      email,
    })
    return token
  }
  async logIn({ email, password }: IAuth) {
    const {
      data: { token },
    } = await this.axios.post(`${settings.authServiceBaseUrl}/token`, {
      email,
      password,
    })
    return token
  }
  async getReviewsByProductId({ id }: IProduct) {
    const {
      data: { results },
    } = await this.axios.get(
      `${settings.reviewServiceBaseUrl}/products/${id}/reviews`,
    )
    return results
  }
  async getProductById({ id }: IProduct) {
    try {
      const {
        data: { results },
      } = await this.axios.get(
        `${settings.reviewServiceBaseUrl}/products?vendor_product_id=${id}`,
      )
      if (results && results[0]) {
        return results[0]
      }
    } catch (e) {
      throw e
    }
  }
  async getTransactionById({ id }: ITransaction) {
    try {
      const { data: transaction } = await this.axios.get(
        `${settings.reviewServiceBaseUrl}/transactions/${id}`,
      )
      return transaction
    } catch (e) {
      console.log(e)
    }
  }
  async createReview(review: any) {
    try {
      const { data: reviewResponse } = await this.axios.post(
        `${settings.reviewServiceBaseUrl}/reviews`,
        review,
      )
      return reviewResponse
    } catch (e) {
      console.log(e)
    }
  }
}

export default new DataIntelSdk()
