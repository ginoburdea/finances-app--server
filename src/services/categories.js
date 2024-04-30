import { Category } from '../schemas/Category.js'
import { genValidationError } from '../utils/genValidationError.js'

export const categoriesService = {
    /**
     * @param {{parent?: string}} getCategoriesInput
     * @returns {Promise<{_id: string, name: string, parent?: string}[]>}
     */
    getCategories: async getCategoriesInput => {
        let parentCategory
        if (getCategoriesInput.parent) {
            parentCategory = await Category.findById(getCategoriesInput.parent)
            if (!parentCategory) {
                throw genValidationError(
                    'categoryId',
                    'Category not found. Please select one from the list'
                )
            }
        }

        const categories = await Category.find({
            parent: getCategoriesInput.parent
                ? getCategoriesInput.parent
                : null,
        })

        return categories.map(cat => ({
            _id: cat._id.toString(),
            name: cat.name,
            parent: cat.parent ? cat.parent.toString() : null,
        }))
    },
}
