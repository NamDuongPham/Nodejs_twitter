import { Router } from 'express'
import {
  forgotPasswordController,
  getMeController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator
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
// Description: Submit email to reset password , send email to user
// path: /forgot-password
// Method : POST
// Body:{email:string}
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))
// Description: Verify link in email to reset password
// path: /verify-forgot-password
// Method : POST
// Body:{forgot-password-token:string}
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)
// Description: Resset Password
// path: /resset-password
// Method : POST
// Body:{forgot-password-token:string,password:string , confirm_password:string}
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))
// Description: Get my profile
// path: /me
// Method : GET
// Header:{authorization : Bearer <access_token>}
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))
export default usersRouter
