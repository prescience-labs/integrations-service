import { settings } from '../config/settings'
import Axios from 'axios'

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

interface ICreateOrderParams {
  customerEmail: string
  customerPhone: string
  vendorIntegrationType: string
  vendorIntegrationId: string | number
  vendorProductIds: string[] | number[]
  vendorTransactionId: string
}
class DataIntelSdk {
  private reviewServiceBaseUrl: string = settings.reviewServiceBaseUrl || ''
  createVendor({ integrationType, integrationId, name }: ICreateVendorParams) {
    return Axios.post(`${this.reviewServiceBaseUrl}/v1/vendors`, {
      name,
      integrations_type: integrationType,
      integrations_id: integrationId,
    })
  }
  createProduct({ vendorId, productId, productName }: ICreateProductParams) {
    return Axios.post(
      `${this.reviewServiceBaseUrl}/v1/vendors/${vendorId}/products`,
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
    return Axios.post(
      `${this.reviewServiceBaseUrl}/v1/transactions/comprehensive`,
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
    const { data } = await Axios.get(
      `${settings.reviewServiceBaseUrl}/v1/vendors?integrations_type=${vendorType}&integrations_id=${vendorId}`,
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
}

export default new DataIntelSdk()
