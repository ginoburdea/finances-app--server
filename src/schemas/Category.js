import { Schema, Types, model } from 'mongoose'

const CategorySchema = new Schema({
    name: { type: String, required: true },
    parent: { type: Types.ObjectId, required: false, ref: 'categories' },
})

export const Category = model('categories', CategorySchema)
