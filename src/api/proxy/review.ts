import { Router } from 'express'
import dataIntelSdk from '../../dataIntelSdk'

const router = Router()

router.post('/', async (req, res) => {
  const response = await dataIntelSdk.createReview(req.body)
  res.json(response)
})

export { router }