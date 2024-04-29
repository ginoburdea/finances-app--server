import { authResolvers } from './auth.js'

export const graphqlResolvers = {
    ...authResolvers,
    ping: () => 'pong',
}
