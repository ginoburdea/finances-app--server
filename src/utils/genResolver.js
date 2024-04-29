import Joi from 'joi'
import { genValidationError } from './genValidationError.js'
import { GraphQLError } from 'graphql'

/**
 *
 * @param {{getData: (obj: any) => any, validator: typeof Joi, handler: (data: any)=> Promise<any>, requiresAuth: boolean}} param0
 * @returns {(obj: any) => Promise<any>}
 */
export const genResolver = ({
    getData,
    validator,
    handler,
    requiresAuth = false,
}) => {
    return async (rawData, args) => {
        const data = getData(rawData)

        if (requiresAuth && !args?.userId) {
            throw new GraphQLError(
                'You must be logged in to perform this action',
                { extensions: { code: 'UNAUTHENTICATED' } }
            )
        }

        const { value, error } = validator.validate(data, {
            allowUnknown: true,
            stripUnknown: true,
            abortEarly: true,
        })
        if (error) {
            const { path, message } = error.details[0]
            throw genValidationError(path, message)
        }

        return await handler({ ...value, userId: args?.userId })
    }
}
