import Joi from 'joi'
import { mongoIdPattern } from '../../../../src/utils/mongoIdPattern.js'

const categoryValidator = Joi.object({
    _id: Joi.string().pattern(mongoIdPattern),
    name: Joi.string().required(),
})

const entryValidator = Joi.object({
    _id: Joi.string().pattern(mongoIdPattern).required(),
    date: Joi.date().iso().required(),
    sum: Joi.number().required(),
    category: categoryValidator,
})

export const entriesServiceValidators = {
    addEntry: entryValidator,
    getEntries: Joi.array().items(entryValidator),
    getEntryTotals: Joi.array().items(
        Joi.object({
            date: Joi.date().iso().required(),
            sum: Joi.number().required(),
            category: categoryValidator,
        })
    ),
}
