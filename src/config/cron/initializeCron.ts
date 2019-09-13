import { IInitializeStore } from "../../api/integrations/shopify/initialize";
import updateStores from "./CronJobs/updateStore";

export function initializeShopifyCron() {
  
  const crons = [...updateStores()]

  crons.forEach(c => c.start())
}