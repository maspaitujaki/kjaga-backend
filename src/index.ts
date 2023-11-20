import express, { type NextFunction, type Request, type Response } from 'express'
import cors from 'cors'
import userAuthRoutes from './modules/user-auth/route'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './api-doc.json'
import * as dotenv from 'dotenv'
import foodRoutes from './modules/food/route'
import morgan from 'morgan'
import predictRoutes from './modules/predict/route'

dotenv.config()

const app = express()
const port = process.env.PORT ?? 3001

const allowedOrigins = ['*']

const options: cors.CorsOptions = {
  origin: allowedOrigins
}

app.use(morgan('tiny'))

app.use(cors(options))

app.use(express.json())

app.use('/users', userAuthRoutes)
app.use('/foods', foodRoutes)
app.use('/predict', predictRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!')
})

// Add this error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong')
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
