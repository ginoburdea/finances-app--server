import Joi from 'joi'
import { mongoIdPattern } from '../../../../src/utils/mongoIdPattern.js'

export const entriesServiceValidators = {
    addEntry: Joi.object({
        _id: Joi.string().pattern(mongoIdPattern).required(),
        date: Joi.date().iso().required(),
        sum: Joi.number().required(),
        category: {
            _id: Joi.string().pattern(mongoIdPattern),
            name: Joi.string().required(),
        },
    }),
}
