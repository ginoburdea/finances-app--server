import Joi from 'joi'
import { mongoIdPattern } from '../../../../src/utils/mongoIdPattern.js'

export const categoriesServiceValidators = {
    getCategories: Joi.array().items(
        Joi.object({
            _id: Joi.string().pattern(mongoIdPattern).required(),
            name: Joi.string().required(),
            parent: Joi.string().pattern(mongoIdPattern).allow(null),
            hasChildren: Joi.bool().required(),
        })
    ),
}
