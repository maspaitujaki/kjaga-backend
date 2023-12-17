import { type Request, type Response } from 'express'
import foodRepo from './repo'
import { validationResult } from 'express-validator'
import errorHandler from '../../errorHandler'

const foodController = {
  getFoods: (req: Request, res: Response) => {
    const { search } = req.query

    if (search === undefined || search === '') {
      foodRepo.selectAllWithDefaultPortion()
        .then((result) => {
          res.status(200).json(result)
        }).catch((error) => {
          res.status(500).json({ message: error.message })
        })
    } else {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const keywords = search.toString().toLowerCase().split(' ').map((word) => `%${word}%`)
      foodRepo.searchFoodWithDefaultPortion(keywords)
        .then((result) => {
          res.status(200).json(result)
        }).catch((error) => {
          res.status(500).json({ message: error.message })
        })
    }
  },
  getPortions: (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.status(400).json({ messsage: errors.array()[0].msg })
      return
    }

    const { food_id: foodId } = req.params

    foodRepo.getPortionsByFoodId(foodId)
      .then((result) => {
        res.status(200).json(result)
      }).catch((error) => {
        errorHandler(error, res)
      })
  }
}

export default foodController
