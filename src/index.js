import { loadEnvironment } from './loaders/environment.js'
import { loadServer } from './loaders/server.js'
import { loadDatabase } from './loaders/database.js'
import { appLogger } from './utils/loggers.js'

loadEnvironment()
await loadDatabase()
const app = loadServer()

await new Promise(resolve => {
    app.listen(process.env.APP_PORT, process.env.APP_HOST, resolve)
})
appLogger.info(
    `Listening on http://${process.env.APP_HOST}:${process.env.APP_PORT}`
)
