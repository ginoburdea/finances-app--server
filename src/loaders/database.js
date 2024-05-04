import mongoose from 'mongoose'
import { Category } from '../schemas/Category.js'

export const categories = [
    //
    // Income
    //
    {
        _id: '662f9806fc13ae4967a24110',
        name: 'Income',
        parent: null,
    },
    {
        _id: '662f9806fc13ae4967a24111',
        name: 'Wages',
        parent: '662f9806fc13ae4967a24110',
    },
    {
        _id: '662f9806fc13ae4967a24112',
        name: 'Bonuses',
        parent: '662f9806fc13ae4967a24110',
    },
    {
        _id: '662f9806fc13ae4967a24113',
        name: 'Investments',
        parent: '662f9806fc13ae4967a24110',
    },

    //
    // Expenses
    //
    {
        _id: '662f9806fc13ae4967a24114',
        name: 'Expenses',
        parent: null,
    },

    // Category House
    {
        _id: '662f9806fc13ae4967a24115',
        name: 'House',
        parent: '662f9806fc13ae4967a24114',
    },
    {
        _id: '662f9806fc13ae4967a24116',
        name: 'Rent',
        parent: '662f9806fc13ae4967a24115',
    },
    {
        _id: '662f9806fc13ae4967a24117',
        name: 'Mortgage',
        parent: '662f9806fc13ae4967a24115',
    },
    {
        _id: '662f9806fc13ae4967a24118',
        name: 'Repairs',
        parent: '662f9806fc13ae4967a24115',
    },

    // Category Entertainment
    {
        _id: '662f9806fc13ae4967a24119',
        name: 'Entertainment',
        parent: '662f9806fc13ae4967a24114',
    },
    {
        _id: '662f9806fc13ae4967a2411a',
        name: 'Eating out',
        parent: '662f9806fc13ae4967a24119',
    },
    {
        _id: '662f9806fc13ae4967a2411b',
        name: 'Presents',
        parent: '662f9806fc13ae4967a24119',
    },
    {
        _id: '662f9806fc13ae4967a2411c',
        name: 'Movies',
        parent: '662f9806fc13ae4967a24119',
    },

    // Category Transportation
    {
        _id: '662f9806fc13ae4967a2411d',
        name: 'Transportation',
        parent: '662f9806fc13ae4967a24114',
    },
    {
        _id: '662f9806fc13ae4967a2411e',
        name: 'Bus tickets',
        parent: '662f9806fc13ae4967a2411d',
    },
    {
        _id: '662f9806fc13ae4967a2411f',
        name: 'Train tickets',
        parent: '662f9806fc13ae4967a2411d',
    },
    {
        _id: '662f9806fc13ae4967a24120',
        name: 'Plane tickets',
        parent: '662f9806fc13ae4967a2411d',
    },
    {
        _id: '662f9806fc13ae4967a24121',
        name: 'Gas',
        parent: '662f9806fc13ae4967a2411d',
    },

    // No category
    {
        _id: '662f9806fc13ae4967a24122',
        name: 'Groceries',
        parent: '662f9806fc13ae4967a24114',
    },
    {
        _id: '662f9806fc13ae4967a24123',
        name: 'Clothes',
        parent: '662f9806fc13ae4967a24114',
    },
    {
        _id: '662f9806fc13ae4967a24124',
        name: 'Stationary',
        parent: '662f9806fc13ae4967a24114',
    },
    {
        _id: '662f9806fc13ae4967a24125',
        name: 'Toys',
        parent: '662f9806fc13ae4967a24114',
    },
    {
        _id: '662f9806fc13ae4967a24126',
        name: 'Investments',
        parent: '662f9806fc13ae4967a24114',
    },
    {
        _id: '662f9806fc13ae4967a24127',
        name: 'Personal loans',
        parent: '662f9806fc13ae4967a24114',
    },
    {
        _id: '662f9806fc13ae4967a24128',
        name: 'Credit cards',
        parent: '662f9806fc13ae4967a24114',
    },
]

export const loadDatabase = async () => {
    await mongoose.connect(process.env.MONGO_URL)

    const categoriesCount = await Category.countDocuments()
    if (categoriesCount === categories.length) return

    await Category.deleteMany()
    await Category.insertMany(categories)
}
