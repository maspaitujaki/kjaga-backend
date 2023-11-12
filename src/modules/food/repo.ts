import pool from '../../postgres'
import { type Food, type Portion } from './models'

const selectWithDefaultPortionResultAdapter = (row: { [x: string]: any, food_id: any, food_name: any, portion_id: any, portion_name: any, portion_count: any }): {
  food: Food
  portion_count: number
  portion: Portion
} => {
  const food = {
    id: row.food_id,
    name: row.food_name
  }
  const portion: Portion = {
    id: row.portion_id,
    name: row.portion_name,
    nutrition: {
      'carbohydrates(g)': row['carbohydrates(g)'],
      'energy(kkal)': row['energy(kkal)'],
      'fat(g)': row['fat(g)'],
      'cholesterol(mg)': row['cholesterol(mg)'],
      'protein(g)': row['protein(g)'],
      'fiber(g)': row['fiber(g)'],
      'sugar(g)': row['sugar(g)'],
      'sodium(mg)': row['sodium(mg)'],
      'kalium(mg)': row['kalium(mg)']
    }
  }
  return ({
    food,
    portion_count: row.portion_count,
    portion
  })
}

const foodRepo = {
  selectAllWithDefaultPortion: async () => {
    return await new Promise((resolve, reject) => {
      pool.query(`
        SELECT f."name" food_name, f.id food_id, fp.id portion_id, 
            fp."name" portion_name, CAST(fpc.portion_count as int) portion_count, fp."energy(kkal)" "energy(kkal)",
            fp."fat(g)" "fat(g)", fp."cholesterol(mg)" "cholesterol(mg)",
            fp."protein(g)" "protein(g)", fp."carbohydrates(g)" "carbohydrates(g)",
            fp."fiber(g)" "fiber(g)", fp."sugar(g)" "sugar(g)", fp."sodium(mg)" "sodium(mg)",
            fp."kalium(mg)" "kalium(mg)"
        FROM foods f
        join (
          select *
          from portions p 
          where id  in (
            select max(id)
            from portions p2 
            group by food_id 
            )
          ) as fp
        on f.id = fp.food_id
        join (
          select count(*) portion_count, food_id
          from portions p3 
          group by food_id
        ) as fpc
        on fpc.food_id = f.id;
      `)
        .then((result) => {
          const foods = result.rows.map((row) => selectWithDefaultPortionResultAdapter(row))
          resolve({
            count: result.rowCount,
            foods
          })
        }).catch((error) => {
          reject(error)
        })
    })
  },
  searchFoodWithDefaultPortion: async (keywords: string[]) => {
    return await new Promise((resolve, reject) => {
      pool.query(`
        SELECT f."name" food_name, f.id food_id, fp.id portion_id, 
            fp."name" portion_name, CAST(fpc.portions_count as int) portions_count, fp."energy(kkal)" "energy(kkal)",
            fp."fat(g)" "fat(g)", fp."cholesterol(mg)" "cholesterol(mg)",
            fp."protein(g)" "protein(g)", fp."carbohydrates(g)" "carbohydrates(g)",
            fp."fiber(g)" "fiber(g)", fp."sugar(g)" "sugar(g)", fp."sodium(mg)" "sodium(mg)",
            fp."kalium(mg)" "kalium(mg)"
        FROM foods f
        join (
          select *
          from portions p 
          where id  in (
            select max(id)
            from portions p2 
            group by food_id 
            )
          ) as fp
        on f.id = fp.food_id
        join (
          select count(*) portions_count, food_id
          from portions p3 
          group by food_id
        ) as fpc
        on fpc.food_id = f.id
        where LOWER(f."name") like any($1);
      `,
      [keywords])
        .then((result) => {
          const foods = result.rows.map((row) => selectWithDefaultPortionResultAdapter(row))
          resolve({
            count: result.rowCount,
            foods
          })
        }).catch((error) => {
          reject(error)
        })
    })
  },
  getPortionsByFoodId: async (foodId: any) => {
    return await new Promise((resolve, reject) => {
      pool.query(`
        select f."name" food_name, f."id" food_id, json_agg(to_jsonb(p.*) - 'food_id') as portions
        from portions p 
        join foods f ON f.id = p.food_id
        where p.food_id = $1
        group by f."name", f."id";
      `, [foodId]).then((result) => {
        if (result.rowCount === 0) {
          throw new Error('Food not found')
        }
        const row = result.rows[0]
        const portions = row.portions.map((portion: { [x: string]: any, id: any, name: any }) => {
          const { id, name, ...nutrition } = portion
          return {
            id,
            name,
            nutrition
          }
        })
        const food = {
          name: row.food_name,
          id: row.food_id
        }
        resolve({
          food,
          portions
        })
      }).catch((error) => {
        reject(error)
      })
    })
  }
}

export default foodRepo
