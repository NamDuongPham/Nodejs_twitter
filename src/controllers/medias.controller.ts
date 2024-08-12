import { NextFunction, Request, Response } from 'express'
import mediasService from '~/services/medias.services'
import { handleUploadImage } from '~/utils/file'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadImage(req)
  return res.json({
    result: url
  })
}
