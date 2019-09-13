import { Router } from 'express'
import { router as shopifyRouter } from './shopify'

export interface Integration {
  initialize: () => void
}

const router: Router = Router()

router.use('/shopify', shopifyRouter)

export { router }
