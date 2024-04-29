import { describe, it } from 'mocha'
import { userFactory } from '../utils/factories/auth.js'
import { authService } from '../../src/services/auth.js'
import { expect } from 'chai'
import { authServiceValidator } from '../utils/validators/services/auth.js'
import { faker } from '@faker-js/faker'

describe('Auth service', () => {
    describe('register', () => {
        it('Should register a user', async () => {
            const userData = userFactory.make()

            const res = await authService.register(userData)

            expect(res).to.not.be.undefined
            expect(res).to.matchSchema(authServiceValidator.register)
        })

        it('Should not register a user when the username is in use', async () => {
            const existingUser = await userFactory.create()
            const userData = userFactory.make({
                username: existingUser.username,
            })

            const fn = authService.register.bind(null, userData)

            await expect(fn).to.throwValidationError('username')
        })
    })

    describe('login', () => {
        it('Should log in a user', async () => {
            const userData = userFactory.make()
            await userFactory.create(userData)

            const res = await authService.login(userData)

            expect(res).to.not.be.undefined
            expect(res).to.matchSchema(authServiceValidator.login)
        })

        it('Should not log in a user when the username is not in use', async () => {
            const userData = userFactory.make()

            const fn = authService.login.bind(null, userData)

            await expect(fn).to.throwValidationError('username')
        })

        it('Should not log in a user when the password is incorrect', async () => {
            const existingUser = await userFactory.create()
            const userData = userFactory.make({
                username: existingUser.username,
                password: faker.internet.password(),
            })

            const fn = authService.login.bind(null, userData)

            await expect(fn).to.throwValidationError('password')
        })
    })
})
