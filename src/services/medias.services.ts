import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { getNameFromFullname, handleUploadImage } from '~/utils/file'
import fs from 'fs'
class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    files.map(async (file) => {
      const newName = getNameFromFullname(file.newFilename)
      const newFullFilename = `${newName}.jpg`
      const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFilename)
      sharp(file.filepath).jpeg({ quality: 100 }).toFile(newPath)
      fs.unlinkSync(file.filepath)
      return `http://localhost:4000/uploads/${newName}.jpg`
    })
  }
}
const mediasService = new MediasService()

export default mediasService
