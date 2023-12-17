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
  },
  changeStatusToUploaded: async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return errorHandler(errors.array()[0], res)
    }

    const { predict_id: predictId } = req.params
    const { timeCreated } = req.body
    try {
      await predictRepo.changeStatusToUploaded(predictId, timeCreated)
      res.status(200).send()
    } catch (error) {
      return errorHandler(error, res)
    }
  },

  returnPredictedValue: async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return errorHandler(errors.array()[0], res)
    }
    const { predict_id: predictId } = req.params
    try {
      let i = 1
      while (true) {
        const result = await predictRepo.getPredictedValue(predictId) as any
        if (result.status === 'DONE') {
          return res.status(200).send({ predictions: result.result })
        }
        if (i === 10) {
          throw Error('Request timeout, our AI is busy')
        }
        i = i + 1
        await sleep(4000)
      }
    } catch (error) {
      return errorHandler(error, res)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const sleep = async (ms = 0) => await new Promise((resolve) => setTimeout(resolve, ms))

export default predictController
