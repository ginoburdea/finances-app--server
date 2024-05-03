import Joi from 'joi'

export const authValidators = {
    register: Joi.object({
        name: Joi.string()
            .min(4)
            .max(64)
            .trim()
            .pattern(/^[a-z ']+$/i)
            .required()
            .messages({
                'string.pattern.base':
                    '"name" can only contain letters, spaces and apostrophes',
            }),
        username: Joi.string()
            .min(6)
            .max(64)
            .trim()
            .pattern(/^[a-z0-9_\.]+$/)
            .required()
            .messages({
                'string.pattern.base':
                    '"username" can only contain lowercase letters, numbers, underscores (_), and dots (.)',
            }),
        password: Joi.string().min(8).max(64).required(),
    }),
    login: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }),
}
