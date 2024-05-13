import express from 'express'
import cors from 'cors'
import { createHandler } from 'graphql-http/lib/use/express'
import bodyParser from 'body-parser'
import { graphqlResolvers } from '../resolvers/index.js'
import { buildSchema } from 'graphql'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { graphqlHandleContext } from '../utils/graphqlHandleContext.js'
import morgan from 'morgan'
import pinoHttp from 'pino-http'
import { httpLogger } from '../utils/loggers.js'
import { randomUUID } from 'crypto'
import { errorLoggerMiddleware } from '../utils/errorLoggerMiddleware.js'
import { errors } from '../utils/errors.js'

export const loadServer = () => {
    const app = express()

    app.use(bodyParser.json())
    app.use(cors({ origin: process.env.CORS_WHITELISTED_ORIGIN }))

    if (process.env.NODE_ENV !== 'production') {
        app.use(morgan('common'))
    } else {
        app.use(
            pinoHttp({
                logger: httpLogger,
                redact: ['req.headers.authorization'],
                genReqId: () => randomUUID(),
                quietReqLogger: true,
                serializers: {
                    req: req => ({
                        ...req,
                        id: undefined,
                        remoteAddress:
                            req.headers['x-forwarded-for'] || req.remoteAddress,
                        remotePort:
                            req.headers['x-forwarded-for-port'] ||
                            req.remotePort,
                    }),
                },
            })
        )
    }

    app.use(errorLoggerMiddleware)

    app.all(
        '/graphql',
        createHandler({
            schema: buildSchema(
                readFileSync(resolve('src/schema.gql'), 'utf8')
            ),
            rootValue: graphqlResolvers,
            context: graphqlHandleContext,
        })
    )

    app.use('*', (req, res) => {
        res.status(404).send(errors.notFound)
    })

    app.use((err, req, res, next) => {
        res.status(500).send(errors.unknown)
    })

    return app
}
