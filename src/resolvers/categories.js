import { genResolver } from '../utils/genResolver.js'
import { categoriesValidators } from '../validators/categories.js'
import { categoriesService } from '../services/categories.js'

export const categoriesResolvers = {
    categories: genResolver({
        getData: data => data.getCategoriesInput,
        validator: categoriesValidators.getCategories,
        handler: categoriesService.getCategories,
        requiresAuth: true,
    }),
}
