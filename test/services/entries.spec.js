import { describe, it } from 'mocha'
import { userFactory } from '../utils/factories/auth.js'
import { expect } from 'chai'
import { entriesFactory } from '../utils/factories/entries.js'
import { entriesService } from '../../src/services/entires.js'
import { entriesServiceValidators } from '../utils/validators/services/entires.js'
import { Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import { categories } from '../../src/loaders/database.js'
import dayjs from 'dayjs'

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

    describe('getEntryTotals', () => {
        it('Should get totals in the last 7 days', async () => {
            const user = await userFactory.create()
            const categoryId = faker.helpers.arrayElement(categories)._id
            await entriesFactory.createManyRecent(user.id, 7, 10, {
                categoryId,
            })

            const res = await entriesService.getEntryTotals({
                preset: 'LAST_7_DAYS',
                categoryId,
                userId: user.id,
            })

            expect(res).to.matchSchema(entriesServiceValidators.getEntryTotals)
            expect(res.length).to.be.greaterThan(0)

            const ago7Days = dayjs()
                .subtract(7, 'days')
                .startOf('day')
                .toDate()
                .getTime()
            for (const entry of res) {
                expect(Date.parse(entry.date)).to.be.greaterThanOrEqual(
                    ago7Days
                )
            }
        })

        it('Should get totals in the last 30 days', async () => {
            const user = await userFactory.create()
            const categoryId = faker.helpers.arrayElement(categories)._id
            await entriesFactory.createManyRecent(user.id, 30, 10, {
                categoryId,
            })

            const res = await entriesService.getEntryTotals({
                preset: 'LAST_30_DAYS',
                categoryId,
                userId: user.id,
            })

            expect(res).to.matchSchema(entriesServiceValidators.getEntryTotals)
            expect(res.length).to.be.greaterThan(0)

            const ago30Days = dayjs()
                .subtract(30, 'days')
                .startOf('day')
                .toDate()
                .getTime()
            for (const entry of res) {
                expect(Date.parse(entry.date)).to.be.greaterThanOrEqual(
                    ago30Days
                )
            }
        })

        it('Should get totals in the next 7 days', async () => {
            const user = await userFactory.create()
            const categoryId = faker.helpers.arrayElement(categories)._id
            await entriesFactory.createManySoon(user.id, 7, 10, { categoryId })

            const res = await entriesService.getEntryTotals({
                preset: 'NEXT_7_DAYS',
                categoryId,
                userId: user.id,
            })

            expect(res).to.matchSchema(entriesServiceValidators.getEntryTotals)
            expect(res.length).to.be.greaterThan(0)

            const future7Days = dayjs().add(7, 'days').toDate().getTime()
            for (const entry of res) {
                expect(Date.parse(entry.date)).to.be.lessThanOrEqual(
                    future7Days
                )
            }
        })

        it('Should get totals in the next 30 days', async () => {
            const user = await userFactory.create()
            const categoryId = faker.helpers.arrayElement(categories)._id
            await entriesFactory.createManySoon(user.id, 30, 10, { categoryId })

            const res = await entriesService.getEntryTotals({
                preset: 'NEXT_30_DAYS',
                categoryId,
                userId: user.id,
            })

            expect(res).to.matchSchema(entriesServiceValidators.getEntryTotals)
            expect(res.length).to.be.greaterThan(0)

            const future30Days = dayjs().add(30, 'days').toDate().getTime()
            for (const entry of res) {
                expect(Date.parse(entry.date)).to.be.lessThanOrEqual(
                    future30Days
                )
            }
        })
    })
})
