import pool from '../../postgres'

const predictRepo = {
  createNewPrediction: async (predictId: string, creatorId: string) => {
    return await new Promise((resolve, reject) => {
      pool.query(`
        INSERT INTO  predictions (id, creator_id, created_at, status)
        VALUES ($1, $2, NOW(), 'WAITING')
      `,
      [predictId, creatorId]
      ).then((result) => {
        resolve(result.rows[0])
      }).catch((error) => {
        reject(error)
      })
    })
  },
  checkPredictId: async (Id: string): Promise<boolean> => {
    return await new Promise((resolve, reject) => {
      pool.query('SELECT id FROM predictions WHERE id = $1', [Id])
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
  },
  changeStatusToUploaded: async (predictId: string, uploadedAt: string) => {
    return await new Promise((resolve, reject) => {
      pool.query('UPDATE predictions SET (status, uploaded_at) = ($1, $2) WHERE id = $3',
        ['UPLOADED', uploadedAt, predictId])
        .then((result) => {
          resolve(result.rows[0])
        }).catch((error) => {
          reject(error)
        })
    })
  },
  getPredictedValue: async (predictId: string) => {
    return await new Promise((resolve, reject) => {
      pool.query('SELECT status, result FROM predictions WHERE id = $1',
        [predictId])
        .then((result) => {
          resolve(result.rows[0])
        }).catch((error) => {
          reject(error)
        })
    })
  }
}

export default predictRepo
