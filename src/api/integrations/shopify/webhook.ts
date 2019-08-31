import { Request, Response, Router } from 'express'

const router: Router = Router()

router.post('/', async (req: Request, res: Response) => {
  const data = req.body
})

export { router }
