import { Router } from 'express'
import foodController from './controller'
import { param } from 'express-validator'

const foodRoutes = Router()

foodRoutes.get('/', foodController.getFoods)

const getPortionsValidationRules = [
  param('food_id').exists().withMessage('Please specify food id')
]
foodRoutes.get('/:food_id/portions', getPortionsValidationRules, foodController.getPortions)

export default foodRoutes
