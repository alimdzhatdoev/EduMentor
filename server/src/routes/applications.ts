import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireTutor, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, subject, level, preferredTime, message } = req.body
    if (!name || !phone || !subject || !level) return res.status(400).json({ error: 'Заполните обязательные поля' })
    const app = await prisma.application.create({ data: { name, phone, email, subject, level, preferredTime, message } })
    res.status(201).json(app)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.get('/', authenticate, requireTutor, async (_, res) => {
  try {
    const apps = await prisma.application.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(apps)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.patch('/:id', authenticate, requireTutor, async (req, res) => {
  try {
    const app = await prisma.application.update({ where: { id: req.params.id }, data: req.body })
    res.json(app)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

export default router
