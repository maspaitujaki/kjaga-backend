import pool from '../../postgres'
import { type Nutrition } from '../food/models'
import { type mealType, type createDiaryRequestItem, type CompleteDiary } from './models'

const mealDiariesRepo = {
  readUserDiaryWithNutrition: async (date: string, userId: string): Promise<CompleteDiary> => {
    return await new Promise((resolve, reject) => {
      pool.query(`
        select json_object_agg(cp.meal_type, cp.items) meals
        from (
          select diary.meal_type, json_agg(to_jsonb(diary.*) - 'meal_type') items
          FROM
          (
            select uml."meal_type" meal_type,
              uml.quantity quantity,
              json_build_object('id', p.id,'name', p."name") portion,
              json_build_object('id', f.id,'name', f."name") food,
              to_jsonb(p.*) - 'id' - 'name' - 'food_id' nutrition 
            from users_meal_log uml 
            join foods f 
            on f.id = uml.food_id 
            join portions p 
            on p.id = uml.portion_id 
            where uml."date" = $1 and uml.user_id = $2
          ) diary 
          group by diary.meal_type
        ) cp
      `,
      [date, userId])
        .then((result) => {
          const { meals } = result.rows[0]
          resolve({
            breakfast: (meals?.breakfast) ?? [],
            lunch: (meals?.lunch) ?? [],
            dinner: (meals?.dinner) ?? [],
            snack: (meals?.snack) ?? []
          })
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  readUserAdequacyRate: async (userId: string): Promise<Nutrition> => {
    return await new Promise((resolve, reject) => {
      pool.query(`
      select to_jsonb(at2.*) - 'id' - 'name' - 'gender' - 'body_height(cm)' - 'body_weight(kg)' - 'age_bottom_range' - 'age_top_range' nutrition
      from akg_types at2 
      join users u
      on at2."name" = u.akg_type 
      where u.id = $1
      `,
      [userId])
        .then((result) => {
          if (result.rowCount > 0) {
            resolve(result.rows[0].nutrition)
          }
          throw new Error('User not found')
        }).catch((error) => {
          reject(error)
        })
    })
  },
  insertOneDiary: async (item: createDiaryRequestItem, userId: string, mealType: mealType, date: string) => {
    return await new Promise((resolve, reject) => {
      pool.query(`
        WITH ids AS (SELECT $1::int fid, $2::int pid)
        INSERT 
        INTO users_meal_log (user_id, date, meal_type, food_id, portion_id, quantity)
        SELECT $3, $4, $5, ( SELECT fid FROM ids ), ( SELECT pid FROM ids ), $6
        WHERE EXISTS (
          SELECT 1
          FROM portions p
          JOIN foods f
          ON p.food_id = f.id
          WHERE f.id = ( SELECT fid FROM ids ) and p.id = ( SELECT pid FROM ids )
        )
      `,
      [item.foodId, item.portionId, userId, date, mealType, item.quantity]
      ).then((result) => {
        if (result.rowCount > 0) {
          resolve(result.rows[0])
        }
        throw new Error('Combination of food id and portion id may not exist.')
      }).catch((error) => {
        reject(error)
      })
    })
  }
}

export default mealDiariesRepo
