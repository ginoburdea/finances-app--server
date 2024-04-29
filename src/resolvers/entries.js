import { genResolver } from '../utils/genResolver.js'
import { entriesValidators } from '../validators/entries.js'
import { entriesService } from '../services/entires.js'

export const entriesResolvers = {
    addEntry: genResolver({
        getData: data => data.addEntryInput,
        validator: entriesValidators.addEntry,
        handler: entriesService.addEntry,
        requiresAuth: true,
    }),
    entries: genResolver({
        getData: data => data.getEntriesInput,
        validator: entriesValidators.getEntries,
        handler: entriesService.getEntries,
        requiresAuth: true,
    }),
}
