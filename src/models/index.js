import mongoose from 'mongoose'

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/approve-workflow'

export const connectDb = () => mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
