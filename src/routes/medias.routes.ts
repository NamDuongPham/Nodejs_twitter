import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controller'
import { wrapRequestHandler } from '~/utils/handlers'
const mediasRouter = Router()
// Description: upload
// path: /medias/uplaod-image
// Method : POST
mediasRouter.post('/upload-image', wrapRequestHandler(uploadSingleImageController))
export default mediasRouter
