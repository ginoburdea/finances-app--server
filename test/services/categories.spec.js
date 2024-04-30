import { expect } from 'chai'
import { categoriesService } from '../../src/services/categories.js'
import { categoriesServiceValidators } from '../utils/validators/services/categories.js'
import { faker } from '@faker-js/faker'
import { categories } from '../../src/loaders/database.js'

describe('Categories service', () => {
    describe('getCategories', () => {
        it('Should get the categories with no parent (parent = null)', async () => {
            const res = await categoriesService.getCategories({ parent: null })

            expect(res).to.matchSchema(
                categoriesServiceValidators.getCategories
            )
            expect(res).to.have.length(2)
            for (const category of res) expect(category.parent).to.be.null
        })

        it('Should get the categories with no parent (parent = undefined)', async () => {
            const res = await categoriesService.getCategories({
                parent: undefined,
            })

            expect(res).to.matchSchema(
                categoriesServiceValidators.getCategories
            )
            expect(res).to.have.length(2)
            for (const category of res) expect(category.parent).to.be.null
        })

        it('Should get the categories with no parent (parent not present)', async () => {
            const res = await categoriesService.getCategories({})

            expect(res).to.matchSchema(
                categoriesServiceValidators.getCategories
            )
            expect(res).to.have.length(2)
            for (const category of res) expect(category.parent).to.be.null
        })

        it('Should get the categories when the parent is specified', async () => {
            const category = faker.helpers.arrayElement(
                categories.filter(cat => cat.parent)
            )
            const parent = category.parent

            const res = await categoriesService.getCategories({ parent })

            expect(res).to.matchSchema(
                categoriesServiceValidators.getCategories
            )
            expect(res.length).to.be.greaterThan(0)
            for (const category of res) expect(category.parent).to.equal(parent)
        })
    })
})
