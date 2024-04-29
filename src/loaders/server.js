import express from 'express'
import cors from 'cors'
import { createHandler } from 'graphql-http/lib/use/express'
import bodyParser from 'body-parser'
import { graphqlResolvers } from '../resolvers/index.js'
import { buildSchema } from 'graphql'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { graphqlHandleContext } from '../utils/graphqlHandleContext.js'

export const loadServer = () => {
    const app = express()

    app.use(bodyParser.json())
    app.use(cors({ origin: process.env.CORS_WHITELISTED_ORIGIN }))

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

    return app
}
