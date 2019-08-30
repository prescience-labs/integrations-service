import * as util from 'util'
import * as winston from 'winston'
import { settings } from './settings'

const logger: winston.Logger = winston.createLogger({
  level: settings.logLevel,
  format: winston.format.simple(),
  exitOnError: false,
})

logger.add(
  new winston.transports.Console({
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.printf((data) => {
        const level: string = data.level.toUpperCase()
        let message: string = `[${level}]`

        if (typeof data.message === 'object') {
          message = `${message} \n${util.inspect(
            data.message,
            false,
            null,
            true,
          )}`
        } else {
          message = `${message} ${data.message}`
        }

        return message
      }),
    ),
  })
)

export { logger }
