import { loadEnvironment } from './loaders/environment.js'
import { loadServer } from './loaders/server.js'
import { loadDatabase } from './loaders/database.js'

loadEnvironment()
await loadDatabase()
const app = loadServer()

await new Promise(resolve => {
    app.listen(process.env.APP_PORT, process.env.APP_HOST, resolve)
})
console.log(
    `Listening on http://${process.env.APP_HOST}:${process.env.APP_PORT}`
)
