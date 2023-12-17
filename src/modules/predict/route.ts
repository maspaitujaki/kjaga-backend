import { type RequestHandler, Router } from 'express'
import { query } from 'express-validator'
import { authenticateToken } from '../user-auth/middleware'
import predictController from './controller'

const predictRoutes = Router()

const getUploadStorageSignedUrlValidationRules = [
  query('mime_type').exists().withMessage('Please specify the mime type')
]
predictRoutes.get('/', getUploadStorageSignedUrlValidationRules, authenticateToken, predictController.getSignedUrl as RequestHandler)

// const predictIdExistValidationRules = [
//   param('predict_id').exists().custom(async id => { await predictIdExist(id) }).withMessage('Prediction request not found')
// ]
predictRoutes.get('/:predict_id', predictController.returnPredictedValue as RequestHandler)

export default predictRoutes
