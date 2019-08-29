import express = require('express')

import { router } from './api'

const app: express.Application = express()

app.use('/', router)

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
