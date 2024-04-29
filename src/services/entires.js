import dayjs from 'dayjs'
import { Entry } from '../schemas/Entry.js'
import { Category } from '../schemas/Category.js'
import { genValidationError } from '../utils/genValidationError.js'

export const entriesService = {
    /**
     * @param {{date: Date, categoryId: string, sum: number, userId: string}} addEntryInput
     * @returns {Promise<{_id: string, date: string, category: Category, sum: number}>}
     */
    addEntry: async addEntryInput => {
        const category = await Category.findById(addEntryInput.categoryId)
        if (!category) {
            throw genValidationError(
                'categoryId',
                'Category not found. Please select one from the list'
            )
        }

        const entry = await Entry.create({
            date: dayjs(addEntryInput.date).startOf('day').toDate(),
            sum: addEntryInput.sum,
            category,
            user: addEntryInput.userId,
        })

        return {
            _id: entry._id.toString(),
            date: entry.date.toISOString(),
            sum: entry.sum,
            category: {
                _id: category._id.toString(),
                name: category.name,
            },
        }
    },
}
