import express from 'express'
import dotenv from 'dotenv'
import authRouters from './routes/auth/auth.route'
import protectedRouters from './routes/private-routes/protected.route'
import { connectToDatabase } from './lib/database'
import cors from 'cors'
import { expressApp, httpServer } from './lib/socket'
import path from 'path'

dotenv.config()
const PORT = process.env.PORT || 6888
const __currentDir = path.resolve()
expressApp.use(express.json())
expressApp.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
)

expressApp.use('/api/v1/auth', authRouters)
expressApp.use('/api/v1', protectedRouters)

if (process.env.NODE_ENV === 'production') {
  expressApp.use(express.static(path.join(__currentDir, '../frontend_chat', 'dist')))
  expressApp.get('*', (_req, res) => {
    res.sendFile(path.join(__currentDir, '../frontend_chat', 'dist', 'index.html'))
  })
}

httpServer.listen(PORT, () => {
  console.log(`Backend API is running on http://localhost:${PORT}`)
  connectToDatabase()
})
export default expressApp
