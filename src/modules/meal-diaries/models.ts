import { type Nutrition } from '../food/models'

export interface createDiaryRequestItem {
  foodId: number
  portionId: number
  quantity: number
}

export type mealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface createDiaryRequest {
  items: createDiaryRequestItem[]
}

export interface createDiaryQuery {
  date: string
  mealType: mealType
}

export interface Diary {
  food: {
    id: number
    name: string
  }
  portion: {
    id: number
    name: string
  }
  nutrition: Nutrition
  quantity: number
}

export interface CompleteDiary {
  breakfast: Diary[]
  lunch: Diary[]
  dinner: Diary[]
  snack: Diary[]
}

export interface DiaryReport {
  totalNutrition: Nutrition
  items: Diary[]
}

export interface CompleteDiaryReport {
  totalNutrition: Nutrition
  breakfast: DiaryReport
  lunch: DiaryReport
  dinner: DiaryReport
  snack: DiaryReport
}
