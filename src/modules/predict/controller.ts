import { type Request, type Response } from 'express'
import { validationResult } from 'express-validator'
import errorHandler from '../../errorHandler'
import { generateV4UploadSignedUrl } from '../../cloud/getUploadStorageSignedUrl'
import crypto from 'crypto'
import predictRepo from './repo'
import { type AuthenticatedRequest } from '../user-auth/models'

const predictController = {
  getSignedUrl: async (req: Request, res: Response) => {
    const errors = validationResult(req)

    const allowedTypes = ['image/png', 'image/jpeg']

    if (!errors.isEmpty()) {
      res.status(400).json({ messsage: errors.array()[0].msg })
      return
    }
    const mimeType = req.query.mime_type as string
    if (!allowedTypes.includes(mimeType)) {
      res.status(400).json({ message: 'Mime type is limited to "image/jpeg" and "image/png"' })
      return
    }

    const id = crypto.randomUUID()

    const userId = (req as AuthenticatedRequest).user.id

    try {
      await predictRepo.createNewPrediction(id, userId)
      const url = await generateV4UploadSignedUrl(id, mimeType)
      return res.json({
        prediction_id: id,
        content_type: mimeType,
        url
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message })
      }
      return errorHandler(error, res)
    }
  }
}

export default predictController
