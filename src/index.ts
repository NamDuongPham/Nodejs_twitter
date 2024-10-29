import express from 'express'
import helmet from 'helmet'
import { defaultErrorHandler } from './middlewares/error.middleware'
import bookmarksRouter from './routes/bookmarks.routes'
import likesRouter from './routes/likes.routes'
import mediasRouter from './routes/medias.routes'
import searchRouter from './routes/search.routes'
import staticRouter from './routes/static.routes'
import tweetsRouter from './routes/tweets.routes'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { initFolder } from './utils/file'
// import '~/utils/fake'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import { createServer } from 'http'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import '~/utils/s3'
import { envConfig, isProduction } from './constants/config'
import conversationsRouter from './routes/conversations.routes'
import initSocket from './utils/socket'
// const file = fs.readFileSync(path.resolve('twitter-swagger.yaml'), 'utf-8')
// const swaggerDocument = YAML.parse(file)
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'X clone (Twitter API)',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ],
    persistAuthorization: true
  },
  apis: ['./openapi/*.yaml'] // files containing annotations as above
}

const openapiSpecification = swaggerJsdoc(options)

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexVideoStatus()
  databaseService.indexFollowers()
  databaseService.indexTweets()
})
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
})
const app = express()
const httpServer = createServer(app)
const port = envConfig.port
app.use(
  cors({
    origin: isProduction ? envConfig.clientUrl : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token', 'Origin', 'Accept'],
    exposedHeaders: ['Authorization'],
    credentials: true // Thêm này nếu bạn sử dụng cookies hoặc authentication
  })
)
// Tạo folder uploads
initFolder()
app.use(helmet())
app.use(limiter)
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
app.use('static', staticRouter)
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likesRouter)
app.use('/search', searchRouter)
app.use('/conversations', conversationsRouter)
app.use(defaultErrorHandler)
initSocket(httpServer)
httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
