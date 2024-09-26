import { tweetIdValidator } from '~/middlewares/tweets.middleware'
import { Router } from 'express'
import { bookmarkTweetController, unbookmarkTweetController } from '~/controllers/bookmarks.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { likeTweetController, unlikeTweetController } from '~/controllers/likes.controller'

const likesRouter = Router()
/**
 * Description: Like Tweet
 * Path: /
 * Method: POST
 * Body: { tweet_id: string }
 * Header: { Authorization: Bearer <access_token> }
 */
likesRouter.post(
  '',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(likeTweetController)
)
/**
 * Description: Unlike Tweet
 * Path: /tweets/:tweet_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
likesRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unlikeTweetController)
)
export default likesRouter
