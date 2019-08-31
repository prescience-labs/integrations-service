import { Request, Response, Router } from 'express'
import { router as oauthRouter } from './oauth'

const router: Router = Router()

router.use('/oauth', oauthRouter)

router.get('/', async (req: Request, res: Response) => {
  res.json({
    loc: '/integrations/shopify',
  })
})

export { router }
