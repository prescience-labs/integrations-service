import { settings } from '../../../config/settings'
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

interface ICreateOrderParams {
  customerEmail: string
  customerPhone: string
  vendorIntegrationType: string
  vendorIntegrationId: string | number
  vendorProductIds: string[] | number[]
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
  }: ICreateOrderParams) {
    return Axios.post(
      `${this.reviewServiceBaseUrl}/v1/transactions/comprehensive`,
      {
        customer_email: customerEmail,
        customer_phone: customerPhone,
        vendor_integrations_type: vendorIntegrationType,
        vendor_integrations_id: vendorIntegrationId,
        vendor_product_ids: vendorProductIds,
      },
    )
  }
}

export default new DataIntelSdk()
