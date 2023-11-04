import { type Request } from 'express'

export interface User {
  id: string
  email: string
  username: string
  password: string
  created_at: Date
  updated_at: Date
}

export interface UserAuthInfo {
  id: string
  email: string
  username: string
}

export interface UserUpdateable {
  email: string
  username: string
  gender: 'pria' | 'wanita'
  tanggal_lahir: Date
  umur: number
  jenis_akg: string
  updated_at: Date
}

export interface AuthenticatedRequest extends Request {
  user: UserAuthInfo
}
