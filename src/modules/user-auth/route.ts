import { Router } from 'express'
import { body, param } from 'express-validator'
import userController from './controller'
import { usernameExist } from './customValidator'
// import { authenticateToken } from './middleware'

const userAuthRoutes = Router()

const createUserValidationRules = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Not a correct email'),
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required')
]
userAuthRoutes.post('/', createUserValidationRules, userController.createNewUser)

const usernameValidationRules = [
  param('username').exists().custom(async username => { await usernameExist(username) })
]
userAuthRoutes.get('/:username', usernameValidationRules, userController.getUserByUsername)

const updateUserValidationRules = [
  ...usernameValidationRules,
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Not a correct email'),
  body('username').notEmpty().withMessage('Username is required'),
  body('gender').notEmpty().withMessage('Please fill in gender').isIn(['male', 'female']),
  body('birthdate').notEmpty().withMessage('Birthdate is required').isDate().withMessage('Date format is required for birthdate')
]
userAuthRoutes.put('/:username', updateUserValidationRules, userController.updateUserByUsername)
userAuthRoutes.delete('/:username', usernameValidationRules, userController.deleteUserByUsername)

const loginValidationRules = [
  body('username').exists().custom(async username => { await usernameExist(username) })
]
userAuthRoutes.post('/login', loginValidationRules, userController.userLogin)

export default userAuthRoutes
