import Joi from 'joi'
import { genValidationError } from './genValidationError.js'

/**
 *
 * @param {{getData: (obj: any) => any, validator: Joi.AnySchema, handler: (data: any)=> Promise<any>}} param0
 * @returns {(obj: any) => Promise<any>}
 */
export const genResolver = ({ getData, validator, handler }) => {
    return async rawData => {
        const data = getData(rawData)

        const { value, error } = validator.validate(data, {
            allowUnknown: true,
            stripUnknown: true,
            abortEarly: true,
        })
        if (error) {
            const { path, message } = error.details[0]
            throw genValidationError(path, message)
        }

        return await handler(value)
    }
}
