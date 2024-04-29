import Joi from 'joi'
import { mongoIdPattern } from '../utils/mongoIdPattern.js'

export const entriesValidators = {
    addEntry: Joi.object({
        date: Joi.date().iso().required(),
        categoryId: Joi.string().pattern(mongoIdPattern, 'id').required(),
        sum: Joi.number().min(0.01).precision(2).required(),
    }),
}