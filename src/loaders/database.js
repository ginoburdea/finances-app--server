import mongoose from 'mongoose'

export const loadDatabase = async () => {
    await mongoose.connect(process.env.MONGO_URL)
}
