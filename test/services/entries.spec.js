import { describe, it } from 'mocha'
import { userFactory } from '../utils/factories/auth.js'
import { expect } from 'chai'
import { entriesFactory } from '../utils/factories/entries.js'
import { entriesService } from '../../src/services/entires.js'
import { entriesServiceValidators } from '../utils/validators/services/entires.js'
import { Types } from 'mongoose'

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
})
