import { type Response, type NextFunction, type Request } from 'express'
import jwt from 'jsonwebtoken'
import { type UserAuthInfo, type AuthenticatedRequest } from './models'
import userRepo from './repo'
import { validationResult } from 'express-validator'
import errorHandler from '../../errorHandler'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function authenticateToken (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (err) { return res.sendStatus(403) }

    (req as AuthenticatedRequest).user = user

    next()
  })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function checkUserWithIdExist (req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ messsage: errors.array()[0].msg })
  }

  const { id } = req.params

  userRepo.selectOne(id)
    .then((result) => {
      (req as AuthenticatedRequest).user = result as UserAuthInfo
      next()
    }).catch((error) => {
      errorHandler(error, res)
    })
}
