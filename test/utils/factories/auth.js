import { faker } from '@faker-js/faker'
import { User } from '../../../src/schemas/User.js'
import { hash } from 'bcrypt'

/**
 * @typedef {Object} RegisterInput
 * @param {string} name
 * @param {string} username
 * @param {string} password
 */

export const userFactory = {
    /**
     * @param {RegisterInput?} overrides
     * @returns {RegisterInput}
     */
    make: (overrides = {}) => ({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        ...overrides,
    }),
    /**
     * @param {RegisterInput?} overrides
     * @returns {Promise<User>}
     */
    create: async (overrides = {}) => {
        const data = userFactory.make(overrides)
        const user = await User.create({
            ...data,
            password: await hash(data.password, 4),
        })
        return user
    },
}
