import { Request, Response, Router } from 'express'
import dataIntelSdk from '../../../../dataIntelSdk';

const router = Router();

router.get('/:productId/reviews', async (req, res) => {
  const productId = req.params['productId']
  const reviews = await dataIntelSdk.getReviewsByProductId({ id: productId })
  res.json(reviews)
})

router.get('/:productId', async (req, res) => {
  const productId = req.params['productId']
  try {
    const product = await dataIntelSdk.getProductById({ id: productId })
    console.log(product)
    res.json(product)

  }
  catch (e) {
    res.sendStatus(500)
  }
})


export { router }