import { CronJob } from 'cron'
import { updateStore, IInitializeStore } from '../../../api/integrations/shopify/initialize'

export default (params: IInitializeStore) => [new CronJob('*/5 * * * * *', () => {
  updateStore(params)
})]