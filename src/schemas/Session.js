import { Schema, Types, model } from 'mongoose'
import { User } from './User.js'

const SessionSchema = new Schema({
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },

    user: { type: Types.ObjectId, required: true, ref: User },

    updatedAt: { type: Date, default: Date.now() },
    createdAt: { type: Date, default: Date.now },
})

export const Session = model('sessions', SessionSchema)
