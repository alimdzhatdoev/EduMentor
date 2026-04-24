import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireTutor, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

const studentInclude = {
  user: { select: { fullName: true, email: true, phone: true, avatarUrl: true } },
  lessons: { orderBy: { date: 'desc' as const }, take: 3 },
  payments: { orderBy: { createdAt: 'desc' as const }, take: 3 },
}

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const students = await prisma.student.findMany({ include: studentInclude, orderBy: { createdAt: 'desc' } })
    res.json(students)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { id: req.params.id }, include: { user: true, lessons: true, homework: true, materials: true, payments: true } })
    if (!student) return res.status(404).json({ error: 'Не найдено' })
    res.json(student)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.post('/', authenticate, requireTutor, async (req, res) => {
  try {
    const { fullName, email, phone, subject, level, notes, password } = req.body
    const bcrypt = require('bcryptjs')
    const passwordHash = bcrypt.hashSync(password || 'student123', 10)
    const user = await prisma.user.create({ data: { fullName, email, phone, passwordHash, role: 'STUDENT' } })
    const student = await prisma.student.create({ data: { userId: user.id, subject, level, notes } })
    res.status(201).json(student)
  } catch (err: any) {
    if (err.code === 'P2002') return res.status(400).json({ error: 'Email уже используется' })
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.patch('/:id', authenticate, requireTutor, async (req, res) => {
  try {
    const { subject, level, notes } = req.body
    const student = await prisma.student.update({ where: { id: req.params.id }, data: { subject, level, notes } })
    res.json(student)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.delete('/:id', authenticate, requireTutor, async (req, res) => {
  try {
    await prisma.student.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

export default router
