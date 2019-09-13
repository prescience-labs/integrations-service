import { IInitializeStore } from "../../api/integrations/shopify/initialize";
import updateStore from "./CronJobs/updateStore";

export function initializeShopifyCron(params: IInitializeStore) {
  const crons = [...updateStore(params)]

  crons.forEach(c => c.start())
}