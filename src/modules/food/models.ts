export interface Food {
  id: number
  name: string
}

export interface Portion {
  id: number
  name: string
  nutrition: Nutrition
}

export interface Nutrition {
  'energy(kkal)': number
  'fat(g)': number
  'cholesterol(mg)': number
  'protein(g)': number
  'carbohydrates(g)': number
  'fiber(g)': number
  'sugar(g)': number
  'sodium(mg)': number
  'kalium(mg)': number
}
