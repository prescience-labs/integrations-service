import { IInitializeStore } from '../../api/integrations/shopify/initialize'
import updateStores from './CronJobs/updateStore'
import herokuKeepAlive from './CronJobs/herokuKeepAlive'

export function initializeShopifyCron() {
  const crons = [...updateStores(), ...herokuKeepAlive()]

  crons.forEach((c) => c.start())
}
