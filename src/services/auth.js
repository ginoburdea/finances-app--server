import { User } from '../schemas/User.js'
import { genValidationError } from '../utils/genValidationError.js'
import { Session } from '../schemas/Session.js'
import { randomBytes } from 'crypto'
import dayjs from 'dayjs'
import { compare, hash } from 'bcrypt'

const genSession = async userId => {
    const session = await Session.create({
        token: randomBytes(128).toString('base64url'),
        expiresAt: dayjs().add(14, 'days').startOf('day').toDate(),
        user: userId,
    })

    return {
        token: session.token,
        expiresAt: session.expiresAt.toISOString(),
    }
}

const userPublicInfo = user => ({
    name: user.name,
    username: user.username,
})

export const authService = {
    /**
     * @param {{name: string, username: string, password: string}} registerInput
     * @returns {Promise<{session: { token: string, expiresAt: string }, user: { name: string, username: string }}>}
     */
    register: async registerInput => {
        const existingUser = await User.findOne({
            username: registerInput.username,
        })
        if (existingUser) {
            throw genValidationError('username', 'username is already in use')
        }

        const user = await User.create({
            name: registerInput.name,
            username: registerInput.username,
            password: await hash(registerInput.password, 12),
        })

        return {
            session: await genSession(user._id),
            user: userPublicInfo(user),
        }
    },
    /**
     * @param {{ username: string, password: string}} registerInput
     * @returns {Promise<{session: { token: string, expiresAt: string }, user: { name: string, username: string }}>}
     */
    login: async loginInput => {
        const user = await User.findOne({ username: loginInput.username })
        if (!user) {
            throw genValidationError(
                'username',
                'there is no user registered with that username'
            )
        }

        const correctPassword = await compare(
            loginInput.password,
            user.password
        )
        if (!correctPassword) {
            throw genValidationError('password', 'wrong password')
        }

        return {
            session: await genSession(user._id),
            user: userPublicInfo(user),
        }
    },
    /**
     *
     * @param {string} token
     * @returns {Promise<User?>}
     */
    tokenToUser: async token => {
        const session = await Session.findOne({ token })
        if (!session) return

        if (session.expiresAt < new Date()) {
            await Session.deleteOne({ _id: session._id })
            return
        }

        return session.user
    },
}
