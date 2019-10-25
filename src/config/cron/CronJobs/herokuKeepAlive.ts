import Axios from 'axios'
import { settings } from '../../settings'
import { CronJob } from 'cron';

export default () => [
  new CronJob('0 */2 * * * *', () => {
    // Axios.get(settings.baseUrl)
  }),
]
