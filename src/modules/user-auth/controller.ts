import { validationResult } from 'express-validator'
import { type Request, type Response } from 'express'
import { type UserUpdateable, type User, type AuthenticatedRequest } from './models'
import crypto from 'crypto'
import userRepo from './repo'
import { generateAccessToken, getAge } from './helper'

const userController = {
  createNewUser: (req: Request, res: Response): void => {
    const errors = validationResult(req)
    const { email, name, password, confirmPassword } = req.body
    if (!errors.isEmpty()) {
      res.status(400).json({ messsage: errors.array()[0].msg, error: true })
      return
    }

    const hashedPassword = crypto.createHash('md5').update(password).digest('hex')
    const hashedCpassword = crypto.createHash('md5').update(confirmPassword).digest('hex')
    if (hashedCpassword !== hashedPassword) {
      res.status(400).json({ message: "Confirm password don't match password", error: true })
      return
    }

    const now = new Date()
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      password: hashedPassword,
      created_at: now,
      updated_at: now
    }
    userRepo.createOne(newUser)
      .then((result) => {
        res.status(201).json({ ...(result as object), error: false })
      }).catch((error) => {
        res.status(400).json({ message: error.message, error: true })
      })
  },
  createNewUserV2: (req: Request, res: Response): void => {
    const errors = validationResult(req)
    let { email, name, password, confirmPassword } = req.query
    email = email as unknown as string
    name = name as unknown as string
    password = password as unknown as string
    confirmPassword = confirmPassword as unknown as string
    if (!errors.isEmpty()) {
      res.status(400).json({ messsage: errors.array()[0].msg, error: true })
      return
    }

    const hashedPassword = crypto.createHash('md5').update(password).digest('hex')
    const hashedCpassword = crypto.createHash('md5').update(confirmPassword).digest('hex')
    if (hashedCpassword !== hashedPassword) {
      res.status(400).json({ message: "Confirm password don't match password", error: true })
      return
    }

    const now = new Date()
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      password: hashedPassword,
      created_at: now,
      updated_at: now
    }
    userRepo.createOne(newUser)
      .then((result) => {
        res.status(201).json({ ...(result as object), error: false })
      }).catch((error) => {
        res.status(400).json({ message: error.message, error: true })
      })
  },
  getUserById: (req: Request, res: Response) => {
    res.status(200).json({ user: (req as AuthenticatedRequest).user })
  },
  getUserByAuth: (req: Request, res: Response) => {
    const { id } = (req as AuthenticatedRequest).user

    userRepo.selectOne(id)
      .then((result) => {
        res.status(200).json({ user: result })
      }).catch((error) => {
        res.status(400).json({ message: error.message })
      })
  },
  updateUserById: (req: Request, res: Response) => {
    const { id } = req.params
    const { email, name, gender, birthdate } = req.body

    // TODO: Tentukan akg_type
    const akgType = ''

    const updateInfo: UserUpdateable = {
      email,
      name,
      gender,
      birthdate,
      age: getAge(new Date(birthdate)),
      akg_type: akgType,
      updated_at: new Date()
    }

    userRepo.updateUser(id, updateInfo)
      .then((result) => {
        res.status(200).json({ user: result })
      }).catch((error) => {
        res.status(400).json({ message: error.message })
      })
  },
  deleteUserById: (req: Request, res: Response) => {
    const { id } = req.params

    userRepo.deleteOne(id)
      .then(result => {
        res.status(200).json({ message: result })
      }).catch((error) => {
        res.status(400).json({ message: error })
      })
  },
  userLogin: (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ messsage: errors.array()[0].msg, error: true })
    }
    const { email, password } = req.body
    userRepo.selectOneAuth(email)
      .then((user) => {
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex')

        if (user === undefined || hashedPassword !== user.password) {
          res.status(401).json({ message: 'email and password combination not found', error: true })
          return
        }
        const userInfo = {
          id: user.id,
          email: user.email,
          name: user.name
        }
        const token = generateAccessToken(userInfo)
        res.status(200).json({ user: userInfo, token, error: false })
      }).catch((error) => {
        res.status(401).json({ message: error, error: true })
      })
  },
  userLoginV2: (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ messsage: errors.array()[0].msg, error: true })
    }
    const { email, password } = req.query
    userRepo.selectOneAuth(email as unknown as string)
      .then((user) => {
        const hashedPassword = crypto.createHash('md5').update(password as unknown as string).digest('hex')

        if (user === undefined || hashedPassword !== user.password) {
          res.status(401).json({ message: 'email and password combination not found', error: true })
          return
        }
        const userInfo = {
          id: user.id,
          email: user.email,
          name: user.name
        }
        const token = generateAccessToken(userInfo)
        res.status(200).json({ user: userInfo, token, error: false })
      }).catch((error) => {
        res.status(401).json({ message: error, error: true })
      })
  }
}

export default userController
