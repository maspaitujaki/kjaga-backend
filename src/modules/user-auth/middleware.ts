import { type Response, type NextFunction, type Request } from 'express'
import jwt from 'jsonwebtoken'
import { type AuthenticatedRequest } from './models'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function authenticateToken (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    console.log(err)

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (err) { return res.sendStatus(403) }

    (req as AuthenticatedRequest).user = user

    next()
  })
}
