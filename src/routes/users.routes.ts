import { Router } from 'express'
import {
  verifyEmailController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const usersRouter = Router()

// Description: Login a  user
// path: /users/login
// Method : POST
// body:{name:string,email:string,pass:string}
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
// Description: Register a new user
// path: /users/register
// Method : POST
// body:{name:string,email:string,pass:string,confirm_pass:string, date_of_birth:ISO8601}
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
// Description: Logout a  user
// path: /users/logout
// Method : POST
// Header{authorization : Bearer <access_token>}
// Body:{refresh_token:string}
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
// Description: verify email when  user cliick on the link in email
// path: /verify-email
// Method : POST
// Body:{email_verify_token:string}
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))
// Description: resend email when  user cliick on the link in email
// path: /resend-verify-email
// Method : POST
// Header{authorization : Bearer <access_token>}
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))
export default usersRouter
