import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginController)
// Description: Register a new user
// path: /users/register
// Method : POST
// body:{name:string,email:string,pass:string,confirm_pass:string, date_of_birth:ISO8601}
usersRouter.post('/register', registerValidator, registerController)
export default usersRouter
