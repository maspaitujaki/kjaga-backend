import { type Response } from 'express'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const errorHandler = (error: unknown, res: Response) => {
  if (error instanceof Error) {
    if (error.message.endsWith('not found')) {
      return res.status(404).json({ message: error.message })
    }
  }

  return res.status(500).json({ message: 'Internal server Error' })
}

export default errorHandler
