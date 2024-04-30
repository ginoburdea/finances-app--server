import { authResolvers } from './auth.js'
import { categoriesResolvers } from './categories.js'
import { entriesResolvers } from './entries.js'

export const graphqlResolvers = {
    ...authResolvers,
    ...entriesResolvers,
    ...categoriesResolvers,
    ping: () => 'pong',
}
