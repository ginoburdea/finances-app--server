import { faker } from '@faker-js/faker'
import { categories } from '../../../src/loaders/database.js'
import { Entry } from '../../../src/schemas/Entry.js'
import dayjs from 'dayjs'

export const entriesFactory = {
    make: (userId, overwrites) => ({
        sum: faker.number.float({ min: 0.01, max: 10000, multipleOf: 0.01 }),
        date: faker.date.recent(),
        categoryId: faker.helpers.arrayElement(categories)._id,
        userId,
        ...overwrites,
    }),
    createMany: async (
        userId,
        count = faker.number.int({ min: 25, max: 50 }),
        overwrites = {}
    ) => {
        const entities = Array(count)
            .fill(null)
            .map(() => entriesFactory.make(userId, overwrites))
            .map(data => ({
                sum: data.sum,
                date: dayjs(data.date).startOf('day').toDate(),
                category: data.categoryId,
                user: userId,
            }))

        await Entry.insertMany(entities)
    },
    createManyRecent: async (
        userId,
        recentDays,
        count = faker.number.int({ min: 25, max: 50 }),
        overwrites = {}
    ) => {
        const entities = Array(count)
            .fill(null)
            .map(() => entriesFactory.make(userId, overwrites))
            .map(data => ({
                sum: data.sum,
                date: dayjs(faker.date.recent({ days: recentDays }))
                    .startOf('day')
                    .toDate(),
                category: data.categoryId,
                user: userId,
            }))

        await Entry.insertMany(entities)
    },
    createManySoon: async (
        userId,
        soonDays,
        count = faker.number.int({ min: 25, max: 50 }),
        overwrites = {}
    ) => {
        const entities = Array(count)
            .fill(null)
            .map(() => entriesFactory.make(userId, overwrites))
            .map(data => ({
                sum: data.sum,
                date: dayjs(faker.date.soon({ days: soonDays }))
                    .startOf('day')
                    .toDate(),
                category: data.categoryId,
                user: userId,
            }))

        await Entry.insertMany(entities)
    },
}
