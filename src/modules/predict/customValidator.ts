import predictRepo from './repo'

export async function predictIdExist (id: string): Promise<boolean> {
  const exist = await predictRepo.checkPredictId(id)
  if (!exist) {
    throw new Error('Prediction not found')
  }
  return exist
}
