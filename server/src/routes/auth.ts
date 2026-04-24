import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email и пароль обязательны' })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Неверный email или пароль' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Неверный email или пароль' })

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const { passwordHash, ...userSafe } = user
    res.json({ token, user: userSafe })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, fullName: true, email: true, phone: true, role: true, avatarUrl: true, createdAt: true }
    })
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

export default router
