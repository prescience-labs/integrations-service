import { Router } from 'express'
import { router as productRouter } from './product'

const router = Router()

router.use('/products/', productRouter)

export { router }