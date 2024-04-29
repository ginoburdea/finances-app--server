import { describe, it } from 'mocha'
import { userFactory } from '../utils/factories/auth.js'
import { expect } from 'chai'
import { entriesFactory } from '../utils/factories/entries.js'
import { entriesService } from '../../src/services/entires.js'
import { entriesServiceValidators } from '../utils/validators/services/entires.js'
import { Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import { categories } from '../../src/loaders/database.js'

describe('Entries service', () => {
    describe('addEntry', () => {
        it('Should add a new entry', async () => {
            const user = await userFactory.create()
            const entriesData = entriesFactory.make(user.id)

            const res = await entriesService.addEntry(entriesData)

            expect(res).to.matchSchema(entriesServiceValidators.addEntry)
        })

        it('Should not add a new entry when the category does not exist', async () => {
            const user = await userFactory.create()
            const entriesData = entriesFactory.make(user.id, {
                categoryId: new Types.ObjectId().toString(),
            })

            const fn = entriesService.addEntry.bind(null, entriesData)

            await expect(fn).to.throwValidationError('categoryId')
        })
    })

    describe('getEntries', () => {
        it('Should get entries on the first page', async () => {
            const user = await userFactory.create()
            const date = faker.date.recent()
            await entriesFactory.createMany(user.id, 30, { date })

            const res = await entriesService.getEntries({
                date,
                page: 0,
                userId: user.id,
            })

            expect(res).to.matchSchema(entriesServiceValidators.getEntries)
            expect(res).to.have.length(25)
        })

        it('Should get entries on the second page', async () => {
            const user = await userFactory.create()
            const date = faker.date.recent()
            await entriesFactory.createMany(user.id, 30, { date })

            const res = await entriesService.getEntries({
                date,
                page: 1,
                userId: user.id,
            })

            expect(res).to.matchSchema(entriesServiceValidators.getEntries)
            expect(res).to.have.length(5)
        })

        it('Should get entries on the first page when filtering by category', async () => {
            const user = await userFactory.create()
            const date = faker.date.recent()
            const category = faker.helpers.arrayElement(categories)._id
            await entriesFactory.createMany(user.id, 30, {
                date,
                categoryId: category,
            })

            const res = await entriesService.getEntries({
                date,
                page: 0,
                userId: user.id,
            })

            expect(res).to.matchSchema(entriesServiceValidators.getEntries)
            expect(res).to.have.length(25)
            for (const entry of res) {
                expect(entry.category._id).to.equal(category)
            }
        })

        it('Should get entries on the second page when filtering by category', async () => {
            const user = await userFactory.create()
            const date = faker.date.recent()
            const category = faker.helpers.arrayElement(categories)._id
            await entriesFactory.createMany(user.id, 30, {
                date,
                categoryId: category,
            })

            const res = await entriesService.getEntries({
                date,
                page: 1,
                userId: user.id,
            })

            expect(res).to.matchSchema(entriesServiceValidators.getEntries)
            expect(res).to.have.length(5)
            for (const entry of res) {
                expect(entry.category._id).to.equal(category)
            }
        })

        it('Should get entries on the first page when filtering by category and it should include entities from subcategories', async () => {
            const user = await userFactory.create()
            const date = faker.date.recent()

            const category = faker.helpers.arrayElement(
                categories.filter(cat => cat.parent)
            )
            await entriesFactory.createMany(user.id, 20, {
                date,
                categoryId: category._id,
            })
            const parentCategory = categories.find(
                cat => cat._id === category.parent
            )

            const res = await entriesService.getEntries({
                date,
                page: 0,
                userId: user.id,
                categoryId: parentCategory._id,
            })

            expect(res).to.matchSchema(entriesServiceValidators.getEntries)
            expect(res).to.have.length(20)
        })
    })
})
