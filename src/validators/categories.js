import Joi from 'joi'
import { mongoIdPattern } from '../utils/mongoIdPattern.js'

export const categoriesValidators = {
    getCategories: Joi.object({
        parent: Joi.string().pattern(mongoIdPattern, 'id').allow(null),
    }),
}
