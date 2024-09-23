import { Router } from 'express'
import {
  changePasswordController,
  followController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  oauthController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  unfollowController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middleware'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
import { wrapRequestHandler } from '~/utils/handlers'
const usersRouter = Router()
/**
 * Description. OAuth with Google
 * Path: /oauth/google
 * Method: GET
 * Query: { code: string }
 */
usersRouter.get('/oauth/google', wrapRequestHandler(oauthController))
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
/**
 * Description. Refresh Token
 * Path: /refresh-token
 * Method: POST
 * Body: { refresh_token: string }
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))
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
// Description: Update my profile
// path: /me
// Method : GET
// Header:{authorization : Bearer <access_token>}
// Body:{UserChema}
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)
// Description: Get user profile
// path: /:username
// Method : GET
usersRouter.get('/:username', wrapRequestHandler(getProfileController))
// Description: Follow user
// path: /follow
// Method : POST
// Header:{authorization : Bearer <access_token>}
// Body : {followed_user_id:string}
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)
// Description: Follow user
// path: /follow/user_id
// Method : DELETE
// Header:{authorization : Bearer <access_token>}
// Body : {followed_user_id:string}
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  wrapRequestHandler(unfollowController)
)
/**
 * Description: Change password
 * Path: /change-password
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: { old_password: string, password: string, confirm_password: string }
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default usersRouter
