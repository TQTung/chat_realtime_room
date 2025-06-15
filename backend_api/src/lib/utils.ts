import jwt from 'jsonwebtoken'
import { IUser } from '~/types/auth.type'

export const generateToken = (user: IUser): any => {
  const secretTokenKey = process.env.TOKEN_SECRET
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
  const expireTokenIn = parseInt(process.env.TOKEN_EXPIRE_IN || '86400')
  const expireRefreshIn = parseInt(process.env.REFRESH_TOKEN_EXPIRE_IN || '604800')
  if (!secretTokenKey) {
    throw new Error('JWT_SECRET_KEY is not defined in the environment variables')
  }
  if (!refreshTokenSecret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined in the environment variables')
  }
  const payload = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    profilePicture: user.profilePicture
  }
  const accessToken = jwt.sign(payload, secretTokenKey, {
    expiresIn: expireTokenIn
  })

  const refreshToken = jwt.sign({ userId: user.id }, refreshTokenSecret, {
    expiresIn: expireRefreshIn
  })

  return {
    userId: user.id,
    email: user.email,
    accessToken,
    refreshToken,
    expiresIn: expireTokenIn,
    refreshExpiresIn: expireRefreshIn
  }
}

export const decodeToken = (token: string): any => {
  return jwt.decode(token)
}
