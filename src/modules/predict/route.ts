import { Router } from 'express'
import { query } from 'express-validator'
import { authenticateToken } from '../user-auth/middleware'
import predictController from './controller'

const predictRoutes = Router()

const getUploadStorageSignedUrlValidationRules = [
  query('mime_type').exists().withMessage('Please specify the mime type')
]
predictRoutes.get('/', getUploadStorageSignedUrlValidationRules, authenticateToken, predictController.getSignedUrl)

export default predictRoutes
