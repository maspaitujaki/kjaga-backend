import pool from '../../postgres'
import { type UserUpdateable, type User } from './models'

const userRepo = {
  selectOne: async (username: string) => {
    return await new Promise((resolve, reject) => {
      pool.query('SELECT id, email, username, gender, birthdate, age, akg_type, created_at, updated_at FROM users WHERE username = $1',
        [username])
        .then((result) => {
          resolve(result.rows[0])
        }).catch((error) => {
          reject(error)
        })
    })
  },
  selectOneAuth: async (username: string): Promise<{
    id: string
    email: string
    username: string
    password: string
  }> => {
    return await new Promise((resolve, reject) => {
      pool.query('SELECT id, email, username, password FROM users WHERE username = $1',
        [username])
        .then((result) => {
          resolve(result.rows[0])
        }).catch((error) => {
          reject(error)
        })
    })
  },
  createOne: async (user: User) => {
    return await new Promise((resolve, reject) => {
      pool.query('INSERT INTO users (id, email, password, username, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, username, created_at, updated_at',
        [user.id, user.email, user.password, user.username, user.created_at, user.updated_at]
      ).then((result) => {
        resolve(result.rows[0])
      }).catch((error) => {
        reject(error)
      })
    })
  },
  updateUser: async (username: string, info: UserUpdateable) => {
    return await new Promise((resolve, reject) => {
      pool.query('UPDATE users SET (email, username, gender, birthdate, age, akg_type, updated_at) = ($1, $2, $3, $4, $5, $6, $7) WHERE username = $8 RETURNING id, email, username, gender, tanggal_lahir, umur, jenis_akg, created_at, updated_at',
        [info.email, info.username, info.gender, info.birthdate, info.age, info.akg_type, info.updated_at, username])
        .then((result) => {
          resolve(result.rows[0])
        }).catch((error) => {
          reject(error)
        })
    })
  },
  deleteOne: async (username: string) => {
    return await new Promise((resolve, reject) => {
      pool.query('DELETE FROM users WHERE username = $1',
        [username])
        .then((result) => {
          resolve('User deleted')
        }).catch((error) => {
          reject(error)
        })
    })
  },
  checkUsername: async (username: string): Promise<boolean> => {
    return await new Promise((resolve, reject) => {
      pool.query('SELECT username FROM users WHERE username = $1', [username])
        .then((result) => {
          if (result.rowCount > 0) {
            resolve(true)
          } else {
            resolve(false)
          }
        }).catch((error) => {
          reject(error)
        })
    })
  }
}

export default userRepo
