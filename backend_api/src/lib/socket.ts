import { Server } from 'socket.io'
import { createServer } from 'http'
import express from 'express'

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173']
  }
})

let userSocketMap: Record<string, string> = {}

export function getReceiverSocketId(userId: string) {
  return userSocketMap[userId]
}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  const userId = socket.handshake.query.userId as string
  if (userId) userSocketMap[userId] = socket.id

  // io sends a message to the connected user
  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    delete userSocketMap[userId]
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

export { io as socketServer, httpServer, app as expressApp }
