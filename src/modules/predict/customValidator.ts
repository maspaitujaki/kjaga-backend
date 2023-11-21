import predictRepo from './repo'

export async function predictIdExist (username: string): Promise<boolean> {
  const exist = await predictRepo.checkPredictId(username)
  if (!exist) {
    throw new Error('Prediction not found')
  }
  return exist
}
