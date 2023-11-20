import userRepo from './repo'

export async function usernameExist (username: string): Promise<boolean> {
  const exist = await userRepo.checkUsername(username)
  if (!exist) {
    throw new Error('Username not found')
  }
  return exist
}
