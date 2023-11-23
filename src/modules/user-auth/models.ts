import { type Request } from 'express'

export interface User {
  id: string
  email: string
  name: string
  password: string
  created_at: Date
  updated_at: Date
}

export interface UserAuthInfo {
  id: string
  email: string
}

export interface UserUpdateable {
  email: string
  name: string
  gender: 'male' | 'female'
  birthdate: Date
  age: number
  akg_type: string
  updated_at: Date
}

export interface AuthenticatedRequest extends Request {
  user: UserAuthInfo
}
