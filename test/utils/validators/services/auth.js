import Joi from 'joi'

const authResponse = Joi.object({
    session: Joi.object({
        token: Joi.string().required(),
        expiresAt: Joi.date().iso().required(),
    }).required(),
    user: Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
    }).required(),
})

export const authServiceValidator = {
    register: authResponse,
    login: authResponse,
}
