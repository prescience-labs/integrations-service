import express = require('express')

import { router } from './api'
import { settings } from './config/settings'

const app: express.Application = express()

app.use('/', router)

app.listen(settings.port, () => {
  console.log(`Example app listening on port ${settings.port}!`)
})
