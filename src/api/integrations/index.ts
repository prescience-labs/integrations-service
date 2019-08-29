import { Router } from 'express'
import { router as shopifyRouter } from './shopify'

const router: Router = Router()

router.use('/shopify', shopifyRouter)

export { router }
