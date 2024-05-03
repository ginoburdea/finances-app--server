import dayjs from 'dayjs'
import { Entry } from '../schemas/Entry.js'
import { Category } from '../schemas/Category.js'
import { genValidationError } from '../utils/genValidationError.js'
import { Types } from 'mongoose'

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
 * @typedef {Object} ITotal
 * @param {string} date
 * @param {number} sum
 * @param {ICategory} category
 */

/**
 * @typedef { 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'NEXT_7_DAYS' | 'NEXT_30_DAYS' } EntryTotalsPresets
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
    const result = [_id]

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
    /**
     * @param {{categoryId: string, preset: EntryTotalsPresets, userId: string}} entryTotalsInput
     * @returns {Promise<ITotal[]>}
     */
    getEntryTotals: async entryTotalsInput => {
        const category = await Category.findById(entryTotalsInput.categoryId)
        if (!category) {
            throw genValidationError(
                'categoryId',
                'Category not found. Please select one from the list'
            )
        }

        const today = dayjs().startOf('day')
        let minDate
        let maxDate

        switch (entryTotalsInput.preset) {
            case 'LAST_7_DAYS': {
                minDate = today.subtract(7, 'days').toDate()
                maxDate = today.toDate()
                break
            }

            case 'LAST_30_DAYS': {
                minDate = today.subtract(30, 'days').toDate()
                maxDate = today.toDate()
                break
            }

            case 'NEXT_7_DAYS': {
                minDate = today.toDate()
                maxDate = today.add(7, 'days').toDate()
                break
            }

            case 'NEXT_30_DAYS': {
                minDate = today.toDate()
                maxDate = today.add(30, 'days').toDate()
                break
            }
        }

        const totals = await Entry.aggregate([
            {
                $match: {
                    user: new Types.ObjectId(entryTotalsInput.userId),
                    date: { $gte: minDate, $lte: maxDate },
                    category: {
                        $in: await getChildCategoryIds(category._id),
                    },
                },
            },
            {
                $set: {
                    sum: { $multiply: ['$sum', 100] },
                },
            },
            {
                $group: {
                    _id: '$date',
                    sum: { $sum: '$sum' },
                },
            },
            {
                $set: {
                    sum: { $divide: ['$sum', 100] },
                },
            },
            {
                $sort: { _id: 1 },
            },
            {
                $set: {
                    date: '$_id',
                },
            },
            {
                $unset: '_id',
            },
        ])

        const oneDay = 86400000
        const totalDays = (maxDate - minDate) / oneDay

        const minDateDayjs = dayjs(minDate)
        return Array(totalDays)
            .fill(null)
            .map((_, index) => {
                const currentDate = minDateDayjs.add(index, 'days')

                const foundTotal = totals.find(total =>
                    dayjs(total.date).isSame(currentDate)
                )
                if (foundTotal) {
                    return { date: foundTotal.date, sum: foundTotal.sum }
                }

                return { date: currentDate, sum: 0 }
            })
            .map(total => ({
                date: total.date.toISOString(),
                sum: total.sum,
                category: {
                    _id: category._id.toString(),
                    name: category.name,
                },
            }))
    },
}
