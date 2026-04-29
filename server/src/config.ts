export const DEFAULT_PORT = 3001
export const BCRYPT_ROUNDS = 10
export const ADMIN_RESET_PASSWORD = '12345678'

export const resolveJwtSecret = (): string => {
  const fromEnv = process.env.JWT_SECRET
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production')
  }
  return 'dev-insecure-jwt-secret-change-me'
}

export const resolveDatabasePath = (): string => {
  return process.env.DATABASE_PATH ?? './data/app.sqlite'
}
