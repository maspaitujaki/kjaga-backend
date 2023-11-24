import { type RequestHandler, Router } from 'express'
import { body, param, query } from 'express-validator'
import { authenticateToken } from '../user-auth/middleware'
import predictController from './controller'
import { predictIdExist } from './customValidator'

const predictRoutes = Router()

const getUploadStorageSignedUrlValidationRules = [
  query('mime_type').exists().withMessage('Please specify the mime type')
]
predictRoutes.get('/', getUploadStorageSignedUrlValidationRules, authenticateToken, predictController.getSignedUrl as RequestHandler)

const predictIdExistValidationRules = [
  param('predict_id').exists().custom(async id => { await predictIdExist(id) }).withMessage('Prediction request not found'),
  body('timeCreated').exists().withMessage('Body should contain timeCreated')
]
predictRoutes.post('/:predict_id', predictIdExistValidationRules, predictController.changeStatusToUploaded as RequestHandler)

export default predictRoutes
