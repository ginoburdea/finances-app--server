import { User } from '../schemas/User.js'
import { genValidationError } from '../utils/genValidationError.js'
import { Session } from '../schemas/Session.js'
import { randomBytes } from 'crypto'
import dayjs from 'dayjs'
import { hash } from 'bcrypt'

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
}
