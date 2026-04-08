import { Server } from 'socket.io'

// Online users map — { userId: socketId }
const onlineUsers = new Map()

let ioInstance = null

export const initSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  })

  ioInstance.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)

    // User apna ID register karta hai
    socket.on('register', (userId) => {
      onlineUsers.set(userId.toString(), socket.id)
      console.log(`User ${userId} registered — socket: ${socket.id}`)
    })

    socket.on('disconnect', () => {
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId)
          console.log(`User ${userId} disconnected`)
          break
        }
      }
    })
  })

  return ioInstance
}

// Kisi specific user ko event bhejo
export const emitToUser = (userId, event, data) => {
  if (!ioInstance) return
  const socketId = onlineUsers.get(userId.toString())
  if (socketId) {
    ioInstance.to(socketId).emit(event, data)
    console.log(`Emitted '${event}' to user ${userId}`)
  }
}

// Sabko broadcast karo (admin use case)
export const emitToAll = (event, data) => {
  if (!ioInstance) return
  ioInstance.emit(event, data)
}

export const getIO = () => ioInstance