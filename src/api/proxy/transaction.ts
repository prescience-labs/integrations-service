import { Router } from 'express'
import dataIntelSdk from '../../dataIntelSdk'

const router = Router()

router.get('/:transactionId', async (req, res) => {
  const transaction = await dataIntelSdk.getTransactionById({ id: req.params['transactionId'] })
  res.json(transaction)
})

export { router }