import { Router } from 'express'
import foodController from './controller'
import { param } from 'express-validator'
import { authenticateToken } from '../user-auth/middleware'

const foodRoutes = Router()

foodRoutes.get('/', foodController.getFoods)

const getPortionsValidationRules = [
  param('food_id').exists().withMessage('Please specify food id')
]
foodRoutes.get('/:food_id/portions', getPortionsValidationRules, foodController.getPortions)

foodRoutes.get('/predict', authenticateToken, foodController.getSignedUrl)

export default foodRoutes
