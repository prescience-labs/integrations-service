import { Request, Response, Router } from 'express'
import { router as integrationsRouter } from './integrations'
import { router as proxyRouter } from './proxy'
const router: Router = Router()

router.use('/integrations', integrationsRouter)

router.use('/proxy', proxyRouter)

router.get('/', async (req: Request, res: Response) => {
  res.json({
    root: true,
  })
})

export { router }
