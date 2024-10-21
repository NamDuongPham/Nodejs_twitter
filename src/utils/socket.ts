import { Server as ServerHttp } from 'http'
import { ObjectId } from 'mongodb'
import { Server } from 'socket.io'
import { UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import Conversation from '~/models/schemas/Conversations.schema'
import databaseService from '~/services/database.services'
import { verifyAccessToken } from '~/utils/commons'

const initSocket = (httpServer: ServerHttp) => {
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
  io.use(async (socket, next) => {
    const { Authorization } = socket.handshake.auth.Authorization
    const access_token = Authorization?.split(' ')[1]
    try {
      const decoded_authorization = await verifyAccessToken(access_token)
      const { verify } = decoded_authorization as TokenPayload
      if (verify !== UserVerifyStatus.Verified) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.USER_NOT_VERIFIED,
          status: HTTP_STATUS.FORBIDDEN
        })
      }
      // Truyền decoded_authorization vào socket để sử dụng ở các middleware khác
      socket.handshake.auth.decoded_authorization = decoded_authorization
      socket.handshake.auth.access_token = access_token
      next()
    } catch (error) {
      next({
        message: 'Unauthorized',
        name: 'UnauthorizedError',
        data: error
      })
    }
  })
  io.on('connection', (socket) => {
    // console.log(socket.handshake.auth._id)
    const user_id = socket.handshake.auth._id

    console.log(`user ${socket.id} connected`)
    users[user_id] = {
      socket_id: socket.id
    }
    socket.use(async (packet, next) => {
      const { access_token } = socket.handshake.auth
      try {
        await verifyAccessToken(access_token)
      } catch (error) {
        next(new Error('Unauthorized'))
      }
    })
    socket.on('erro', (error) => {
      if (error.message === 'Unauthorized') {
        socket.disconnect()
      }
    })
    socket.on('send_message', async (data) => {
      // console.log(data.payload)

      const { receiver_id, sender_id, content } = data.payload

      // console.log('Gửi tin nhắn từ', sender_id, 'đến', receiver_id)
      const receiver_socket_id = users[receiver_id]?.socket_id
      const conversation = new Conversation({
        sender_id: new ObjectId(sender_id as string),
        receiver_id: new ObjectId(receiver_id as string),
        content: content
      })
      const result = await databaseService.conversations.insertOne(conversation)
      conversation._id = result.insertedId
      if (receiver_socket_id) {
        socket.to(receiver_socket_id).emit('receive_message', {
          padload: conversation
        })
      }
    })
    socket.on('disconent', () => {
      delete users[user_id]
      console.log(`Người dùng ${user_id} (${socket.id}) đã ngắt kết nối`)
      // console.log('Đối tượng users đã cập nhật:', users)
    })
  })
}
export default initSocket
