import { Router, type Request, type Response } from 'express'
import { body, validationResult } from 'express-validator'

const exampleRoutes = Router()

const exampleValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('completed').isBoolean().withMessage('Completed must be a boolean')
]

exampleRoutes.post('/', exampleValidationRules, (req: Request, res: Response) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  res.status(201).json({})
})

export default exampleRoutes
