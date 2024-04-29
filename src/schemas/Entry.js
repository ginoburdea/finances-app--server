import { Schema, Types, model } from 'mongoose'
import { Category } from './Category.js'
import { User } from './User.js'

const EntrySchema = new Schema({
    sum: { type: Number, required: true },
    date: { type: Date, required: true },
    category: { type: Types.ObjectId, required: true, ref: Category },
    user: { type: Types.ObjectId, required: true, ref: User },
})

export const Entry = model('entries', EntrySchema)
