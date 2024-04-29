import { authValidators } from '../validators/auth.js'
import { authService } from '../services/auth.js'
import { genResolver } from '../utils/genResolver.js'

export const authResolvers = {
    register: genResolver({
        getData: data => data.registerInput,
        validator: authValidators.register,
        handler: authService.register,
    }),
}
