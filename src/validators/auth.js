import Joi from 'joi'

export const authValidators = {
    register: Joi.object({
        name: Joi.string().min(4).max(64).required(),
        username: Joi.string().min(6).max(64).required(),
        password: Joi.string().min(8).max(64).required(),
    }),
}
