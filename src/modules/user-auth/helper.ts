import jwt from 'jsonwebtoken'
import { type UserAuthInfo } from './models'

export function getAge (dateString: Date): number {
  const today = new Date()
  const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export function generateAccessToken (user: UserAuthInfo): string {
  return jwt.sign(user, process.env.JWT_SECRET ?? 'tango_wafer_renyah', { expiresIn: '24h' })
}
