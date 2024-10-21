import { config } from 'dotenv'
import express from 'express'
import { UPLOAD_IMAGE_TEMP_DIR } from './constants/dir'
import { defaultErrorHandler } from './middlewares/error.middleware'
import mediasRouter from './routes/medias.routes'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { initFolder } from './utils/file'
import staticRouter from './routes/static.routes'
import tweetsRouter from './routes/tweets.routes'
import bookmarksRouter from './routes/bookmarks.routes'
import likesRouter from './routes/likes.routes'
import searchRouter from './routes/search.routes'
// import '~/utils/fake'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import Conversation from './models/schemas/Conversations.schema'
import conversationsRouter from './routes/conversations.routes'
import { ObjectId } from 'mongodb'
config()
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexVideoStatus()
  databaseService.indexFollowers()
  databaseService.indexTweets()
})
const app = express()
const httpServer = createServer(app)
const port = process.env.PORT || 4000

// Tạo folder uploads
initFolder()
app.use(
  cors({
    origin: 'http://localhost:3000'
  })
)
app.use(express.json())
app.use('static', staticRouter)
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likesRouter)
app.use('/search', searchRouter)
app.use('/conversations', conversationsRouter)
app.use(defaultErrorHandler)

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})
const users: {
  [key: string]: {
    socket_id: string
  }
} = {}

io.on('connection', (socket) => {
  // console.log(socket.handshake.auth._id)
  const user_id = socket.handshake.auth._id

  console.log(`user ${socket.id} connected`)
  users[user_id] = {
    socket_id: socket.id
  }
  console.log('Đối tượng users đã cập nhật:', users)
  socket.on('send_message', async (data) => {
    // console.log(data.payload)

    const { receiver_id, sender_id, content } = data.payload

    console.log('Gửi tin nhắn từ', sender_id, 'đến', receiver_id)
    const receiver_socket_id = users[receiver_id]?.socket_id

    if (!receiver_socket_id) {
      console.log('Người nhận không online:', receiver_id)
      return
    }
    const conversation = new Conversation({
      sender_id: new ObjectId(sender_id as string),
      receiver_id: new ObjectId(receiver_id as string),
      content: content
    })
    const result = await databaseService.conversations.insertOne(conversation)
    conversation._id = result.insertedId
    socket.to(receiver_socket_id).emit('receive_message', {
      padload: conversation,
      from: user_id
    })
  })
  socket.on('disconent', () => {
    delete users[user_id]
    console.log(`Người dùng ${user_id} (${socket.id}) đã ngắt kết nối`)
    console.log('Đối tượng users đã cập nhật:', users)
  })
})
httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
