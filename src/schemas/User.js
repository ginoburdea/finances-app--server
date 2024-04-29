import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },

    updatedAt: { type: Date, default: Date.now() },
    createdAt: { type: Date, default: Date.now },
})

export const User = model('users', UserSchema)
