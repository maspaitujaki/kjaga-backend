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
  }
}

export default predictRepo
