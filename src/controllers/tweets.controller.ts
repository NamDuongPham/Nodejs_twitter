import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetType } from '~/constants/enums'
import { TweetRequestBody } from '~/models/requests/Tweet.requests'

import { TokenPayload } from '~/models/requests/User.requests'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  // const result = await tweetsService.createTweet(user_id, req.body)
  // return res.json({
  //   message: 'Create Tweet Successfully',
  //   result
  // })
}