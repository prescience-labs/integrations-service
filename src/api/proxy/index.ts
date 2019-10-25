import { Router } from 'express'
import { router as transactionRouter } from './transaction'
import { router as reviewRouter } from './review'

const router = Router()

router.use('/transactions', transactionRouter)
router.use('/reviews', reviewRouter)
router.get('/', async (req, res) => {
  res.json({
    loc: '/proxy',
  })
})
export { router }