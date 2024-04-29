import { authResolvers } from './auth.js'
import { entriesResolvers } from './entries.js'

export const graphqlResolvers = {
    ...authResolvers,
    ...entriesResolvers,
    ping: () => 'pong',
}
