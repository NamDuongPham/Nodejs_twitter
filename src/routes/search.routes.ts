import { Router } from 'express'
import { searchController } from '~/controllers/searchs.controller'
import { searchValidator } from '~/middlewares/search.middleware'
import { paginationValidator } from '~/middlewares/tweets.middleware'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const searchRouter = Router()
searchRouter.get(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  searchValidator,
  paginationValidator,
  searchController
)
export default searchRouter
