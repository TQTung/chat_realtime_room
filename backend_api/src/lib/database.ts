import mongoose from 'mongoose'

export async function connectToDatabase() {
  const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase'

  try {
    await mongoose.connect(dbUri)
    console.log(`Connected to MongoDB successfully`)
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }
}
