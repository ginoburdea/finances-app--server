import { authService } from '../services/auth.js'

/**
 * @param {import("express").Request} req
 * @returns {Promise<import('../schemas/User').User?>}
 */
export const graphqlHandleContext = async req => {
    if (!req.headers.authorization) return
    if (!req.headers.authorization.match(/^Bearer .+$/)) return

    const token = req.headers.authorization.replace('Bearer ', '')
    const userId = await authService.tokenToUser(token)
    if (!userId) return

    req.raw.log.info({
        msg: 'successful auth',
        context: 'auth-middleware',
        userId,
    })
    return { userId }
}
