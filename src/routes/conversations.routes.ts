import { Router } from 'express'
import { getConversationsController } from '~/controllers/getConversationsController'
import { paginationValidator } from '~/middlewares/tweets.middleware'

import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const conversationsRouter = Router()

conversationsRouter.get(
  '/receivers/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  // paginationValidator,
  // getConversationsValidator,
  wrapRequestHandler(getConversationsController)
)

export default conversationsRouter
