import pino from 'pino'

const logger = pino()

export const appLogger = logger.child({ context: 'app' })
export const httpLogger = logger.child({ context: 'http' })
