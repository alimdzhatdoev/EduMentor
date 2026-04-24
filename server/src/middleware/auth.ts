import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string }
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Не авторизован' })
  }
  try {
    const token = auth.slice(7)
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string; email: string }
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Недействительный токен' })
  }
}

export function requireTutor(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'TUTOR') {
    return res.status(403).json({ error: 'Доступ запрещён' })
  }
  next()
}
