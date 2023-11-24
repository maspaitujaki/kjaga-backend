import { type RequestHandler, Router } from 'express'
import { body, query } from 'express-validator'
import mealDiariesController from './controller'
import { authenticateToken } from '../user-auth/middleware'

const mealDiariesRoutes = Router()

const dateQueryValidationRules = [
  query('date').customSanitizer((value) => value ?? new Date().toLocaleDateString('fr-CA')).exists().isDate().withMessage('Invalid date value')
]
const createMealDiariesValidationRules = [
  ...dateQueryValidationRules,
  query('mealType').exists().isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Please provide meal type with value "breakfast", "lunch", "dinner", or "snack'),
  body('items').exists().withMessage('Items array must exist').isArray({ min: 1 }).withMessage('Items array must not empty.'),
  body('items.*.foodId').not().isEmpty().withMessage('Please provide foodId. Check each element!'),
  body('items.*.portionId').not().isEmpty().withMessage('Please provide portionId. Check each element!'),
  body('items.*.quantity').not().isEmpty().withMessage('Please provide quantity. Check each element!')
]
mealDiariesRoutes.post('', authenticateToken, createMealDiariesValidationRules, mealDiariesController.createNewDiaries as RequestHandler)

mealDiariesRoutes.get('', authenticateToken, dateQueryValidationRules, mealDiariesController.getUserDiaries as RequestHandler)
export default mealDiariesRoutes
