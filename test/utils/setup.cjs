const { GraphQLError } = require('graphql')
const Joi = require('joi')
const { beforeEach, before } = require('mocha')
const mongoose = require('mongoose')

before(async () => {
    const { loadEnvironment } = await import('../../src/loaders/environment.js')
    const { loadDatabase } = await import('../../src/loaders/database.js')
    const { Assertion, expect } = await import('chai')
    const chai = await import('chai')

    loadEnvironment()
    await loadDatabase()

    Assertion.addMethod(
        'matchSchema',
        /**
         * @param {Joi.AnySchema} schema
         */
        function (schema) {
            const data = this._obj

            expect(Joi.isSchema(schema))
            const { error } = schema.validate(data)

            expect(error).to.be.undefined
        }
    )
    Assertion.addMethod(
        'throwValidationError',
        /**
         * @param {string} onField
         */
        async function (onField) {
            const data = this._obj

            let caughtError = false
            try {
                await data()
            } catch (err) {
                caughtError = true
                expect(err).to.be.instanceOf(GraphQLError)

                expect(err?.extensions?.code).to.equal(
                    'GRAPHQL_VALIDATION_FAILED'
                )

                if (typeof onField === 'string') {
                    expect(err?.path?.at(0)).to.equal(onField)
                }
            }

            expect(caughtError).to.be.true
        }
    )
    chai.config.truncateThreshold = 0
})

beforeEach(async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) await collections[key].deleteMany()
})
