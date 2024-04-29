import dayjs from 'dayjs'
import { Entry } from '../schemas/Entry.js'
import { Category } from '../schemas/Category.js'
import { genValidationError } from '../utils/genValidationError.js'

/**
 * @typedef {Object} IEntry
 * @param {string} _id
 * @param {string} date
 * @param {number} sum
 * @param {ICategory} category
 */

/**
 * @typedef {Object} ICategory
 * @param {string} _id
 * @param {string} name
 */

/**
 * @param {Entry} entry
 * @returns {IEntry}
 */
const getEntryPublicInfo = entry => ({
    _id: entry._id.toString(),
    date: entry.date.toISOString(),
    sum: entry.sum,
    category: {
        _id: entry.category._id.toString(),
        name: entry.category.name,
    },
})

const getChildCategoryIds = async _id => {
    const result = []

    const children = await Category.find({ parent: _id }).select('_id').exec()
    for (const child of children) {
        result.push(child._id, ...(await getChildCategoryIds(child._id)))
    }

    return result.map(result => result._id)
}

export const entriesService = {
    /**
     * @param {{date: Date, categoryId: string, sum: number, userId: string}} addEntryInput
     * @returns {Promise<ICategory>}
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
        await entry.populate('category')

        return getEntryPublicInfo(entry)
    },
    /**
     * @param {{date: Date, categoryId?: string, page: number, userId: string}} getEntriesInput
     * @returns {Promise<IEntry[]>}
     */
    getEntries: async getEntriesInput => {
        if (getEntriesInput.categoryId) {
            const category = await Category.findById(getEntriesInput.categoryId)
            if (!category) {
                throw genValidationError(
                    'categoryId',
                    'Category not found. Please select one from the list'
                )
            }
        }

        const entries = await Entry.find({
            date: dayjs(getEntriesInput.date).startOf('day').toDate(),
            user: getEntriesInput.userId,
            ...(!getEntriesInput.categoryId
                ? {}
                : {
                      category: {
                          $in: await getChildCategoryIds(
                              getEntriesInput.categoryId
                          ),
                      },
                  }),
        })
            .limit(25)
            .skip(getEntriesInput.page * 25)
            .populate('category')
            .exec()

        return entries.map(entry => getEntryPublicInfo(entry))
    },
}
