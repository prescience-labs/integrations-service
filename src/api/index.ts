import { Request, Response, Router } from 'express'
import { router as integrationsRouter } from './integrations'

const router: Router = Router()

router.use('/integrations', integrationsRouter)

router.get('/', (req: Request, res: Response) => {
  res.json({
    root: true,
  })
})

export { router }
