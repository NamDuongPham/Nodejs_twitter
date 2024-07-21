import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'phamnamduogn583@gmail.com' && password === '12321312') {
    return res.json({
      message: 'login success'
    })
  }
  return res.status(400).json({
    message: 'login failed'
  })
}
//register
export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    const result = await usersService.register(req.body)
    return res.json({
      message: 'register success',
      result
    })
  } catch (error) {
    return res.status(400).json({
      message: 'register failed'
    })
  }
}
