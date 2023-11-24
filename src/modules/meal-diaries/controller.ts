import { type Response, type Request } from 'express'
import { validationResult } from 'express-validator'
import { type DiaryReport, type CompleteDiary, type CompleteDiaryReport, type Diary, type createDiaryQuery, type createDiaryRequest } from './models'
import mealDiariesRepo from './repo'
import { type AuthenticatedRequest } from '../user-auth/models'
import errorHandler from '../../errorHandler'
import { type Nutrition } from '../food/models'

const multiplyNutritionWithQuantity = (diaries: Diary[]): Diary[] => {
  return diaries.map((diary): Diary => {
    let t: keyof Nutrition
    for (t in diary.nutrition) {
      diary.nutrition[t] = diary.nutrition[t] * diary.quantity
    }
    return {
      ...diary,
      nutrition: diary.nutrition
    }
  })
}

function sumNutritientObjects (...objs: Nutrition[]): Nutrition {
  const initialValue: Nutrition = {
    'energy(kkal)': 0,
    'fat(g)': 0,
    'cholesterol(mg)': 0,
    'protein(g)': 0,
    'carbohydrates(g)': 0,
    'fiber(g)': 0,
    'sugar(g)': 0,
    'sodium(mg)': 0,
    'kalium(mg)': 0
  }
  return objs.reduce<Nutrition>((pv, cv) => {
    let t: keyof Nutrition
    for (t in pv) {
      pv[t] = pv[t] + cv[t]
    }
    return pv
  }, initialValue)
}

const calculateDiaryReport = (diaries: Diary[]): DiaryReport => {
  const nutritionArr = diaries.map((diary) => diary.nutrition)
  const totalNutrition = sumNutritientObjects(...nutritionArr)
  return {
    totalNutrition,
    items: diaries
  }
}

const calculateCompleteDiaryReport = (completeDiary: CompleteDiary): CompleteDiaryReport => {
  const breakfast = calculateDiaryReport(completeDiary.breakfast)
  const lunch = calculateDiaryReport(completeDiary.lunch)
  const dinner = calculateDiaryReport(completeDiary.dinner)
  const snack = calculateDiaryReport(completeDiary.snack)
  const totalNutrition = sumNutritientObjects(breakfast.totalNutrition, lunch.totalNutrition, dinner.totalNutrition, snack.totalNutrition)
  return {
    totalNutrition,
    breakfast,
    lunch,
    dinner,
    snack
  }
}

const mealDiariesController = {
  createNewDiaries: async (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.status(400).json({ messsage: errors.array()[0].msg })
      return
    }

    const { date, mealType } = req.query as unknown as createDiaryQuery
    const { id: userId } = (req as unknown as AuthenticatedRequest).user
    const { items: diaries } = req.body as createDiaryRequest

    const inserted: any[] = []
    const notInserted: any[] = []
    for (const diary of diaries) {
      try {
        await mealDiariesRepo.insertOneDiary(diary, userId, mealType, date)
        inserted.push(diary)
      } catch (error) {
        if (error instanceof Error) {
          notInserted.push({
            item: diary,
            reason: error.message
          })
        }
      }
    }
    res.status(201).json({
      inserted,
      notInserted
    })
  },
  getUserDiaries: async (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.status(400).json({ messsage: errors.array()[0].msg })
      return
    }

    const { date } = req.query as unknown as createDiaryQuery
    const { id: userId } = (req as unknown as AuthenticatedRequest).user

    try {
      const result = await mealDiariesRepo.readUserDiaryWithNutrition(date, userId)
      result.breakfast = multiplyNutritionWithQuantity(result.breakfast)
      result.lunch = multiplyNutritionWithQuantity(result.lunch)
      result.dinner = multiplyNutritionWithQuantity(result.dinner)
      result.snack = multiplyNutritionWithQuantity(result.snack)

      const completeDiaryReport = calculateCompleteDiaryReport(result)
      res.status(200).json(completeDiaryReport)
    } catch (error) {
      errorHandler(error, res)
    }
  }
}

export default mealDiariesController
