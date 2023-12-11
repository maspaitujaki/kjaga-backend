import { Router } from 'express'
import { body, param, query } from 'express-validator'
import userController from './controller'
import { authenticateToken, checkUserWithIdExist } from './middleware'

const userAuthRoutes = Router()

const createUserValidationRules = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Not a correct email'),
  body('name').notEmpty().withMessage('Name is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required')
]

userAuthRoutes.get('/', authenticateToken, userController.getUserByAuth)
userAuthRoutes.post('/', createUserValidationRules, userController.createNewUser)

const idValidationRules = [
  param('id').exists().withMessage('Bad request: please provide id')
]
const updateUserValidationRules = [
  ...idValidationRules,
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Not a correct email'),
  body('name').notEmpty().withMessage('Name is required'),
  body('gender').notEmpty().withMessage('Please fill in gender').isIn(['male', 'female']),
  body('birthdate').notEmpty().withMessage('Birthdate is required').isDate().withMessage('Date format is required for birthdate')
]
userAuthRoutes.get('/:id', idValidationRules, checkUserWithIdExist, userController.getUserById)
userAuthRoutes.put('/:id', updateUserValidationRules, checkUserWithIdExist, userController.updateUserById)
userAuthRoutes.delete('/:id', idValidationRules, checkUserWithIdExist, userController.deleteUserById)

const loginValidationRules = [
  body('email').exists().withMessage('Please provide email'),
  body('password').exists().withMessage('Please provide password')
]
userAuthRoutes.post('/login', loginValidationRules, userController.userLogin)

const loginV2ValidationRules = [
  query('email').exists().withMessage('Please provide email'),
  query('password').exists().withMessage('Please provide password')
]
userAuthRoutes.post('/loginV2', loginV2ValidationRules, userController.userLoginV2)

export default userAuthRoutes
