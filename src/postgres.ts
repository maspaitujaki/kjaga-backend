import { Pool } from 'pg'
import * as dotenv from 'dotenv'
dotenv.config()

const config = {
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
}

const pool = new Pool(config)

export default pool
