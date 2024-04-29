import { faker } from '@faker-js/faker'
import { categories } from '../../../src/loaders/database.js'

export const entriesFactory = {
    make: (userId, overwrites) => ({
        sum: faker.number.int({ min: 0.01 }),
        date: faker.date.recent(),
        categoryId: faker.helpers.arrayElement(categories)._id,
        userId,
        ...overwrites,
    }),
}
