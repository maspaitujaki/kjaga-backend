import pool from '../../postgres'
import { type UserUpdateable, type User } from './models'

const userRepo = {
  selectOne: async (id: string) => {
    return await new Promise((resolve, reject) => {
      pool.query('SELECT id, email, name, gender, birthdate, age, akg_type, created_at, updated_at FROM users WHERE id = $1',
        [id])
        .then((result) => {
          if (result.rowCount <= 0) {
            throw new Error('User not found')
          }
          resolve(result.rows[0])
        }).catch((error) => {
          reject(error)
        })
    })
  },
  selectOneAuth: async (email: string): Promise<{
    id: string
    email: string
    name: string
    password: string
  }> => {
    return await new Promise((resolve, reject) => {
      pool.query('SELECT id, email, name, password FROM users WHERE email = $1',
        [email])
        .then((result) => {
          resolve(result.rows[0])
        }).catch((error) => {
          reject(error)
        })
    })
  },
  createOne: async (user: User) => {
    return await new Promise((resolve, reject) => {
      pool.query('INSERT INTO users (id, email, password, name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, name, created_at, updated_at',
        [user.id, user.email, user.password, user.name, user.created_at, user.updated_at]
      ).then((result) => {
        resolve(result.rows[0])
      }).catch((error) => {
        reject(error)
      })
    })
  },
  updateUser: async (id: string, info: UserUpdateable) => {
    return await new Promise((resolve, reject) => {
      pool.query('UPDATE users SET (email, name, gender, birthdate, age, akg_type, updated_at) = ($1, $2, $3, $4, $5, $6, $7) WHERE id = $8 RETURNING id, email, name, gender, birthdate, age, akg_type, created_at, updated_at',
        [info.email, info.name, info.gender, info.birthdate, info.age, info.akg_type, info.updated_at, id])
        .then((result) => {
          resolve(result.rows[0])
        }).catch((error) => {
          reject(error)
        })
    })
  },
  deleteOne: async (id: string) => {
    return await new Promise((resolve, reject) => {
      pool.query('DELETE FROM users WHERE id = $1',
        [id])
        .then((result) => {
          resolve('User deleted')
        }).catch((error) => {
          reject(error)
        })
    })
  }
}

export default userRepo
