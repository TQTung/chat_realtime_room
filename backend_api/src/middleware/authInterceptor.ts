import { NextFunction, Request } from 'express'

import jwt from 'jsonwebtoken'

export const authInterceptor = (req: Request, res: any, next: NextFunction) => {
  // Check if the request has a valid authorization header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Unauthorized',
      status: 'error'
    })
  }
  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET || '')
    if (typeof decoded === 'string') {
      return res.status(403).json({ message: 'Invalid token structure' })
    }
    req.user = decoded
    next()
  } catch (error) {
    console.error('Token decoding error:', error)
    return res.status(401).json({
      message: 'Invalid token',
      status: 'error'
    })
  }
}
