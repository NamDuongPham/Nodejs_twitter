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
app.use(defaultErrorHandler)

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log(`user ${socket.id} conneted`)
  socket.on('disconent', () => {
    console.log(`user ${socket.id} disconent`)
  })
  socket.emit('hi', {
    message: `Hi client đã kết nối thành công`
  })
  socket.on('hello server', (agr) => {
    console.log(agr)
  })
})
httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
