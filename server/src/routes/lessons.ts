import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireTutor, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    let lessons
    if (req.user!.role === 'TUTOR') {
      lessons = await prisma.lesson.findMany({ include: { student: { include: { user: { select: { fullName: true } } } } }, orderBy: { date: 'asc' } })
    } else {
      const student = await prisma.student.findUnique({ where: { userId: req.user!.id } })
      if (!student) return res.json([])
      lessons = await prisma.lesson.findMany({ where: { studentId: student.id }, orderBy: { date: 'asc' } })
    }
    res.json(lessons)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id }, include: { student: { include: { user: true } }, homework: true } })
    if (!lesson) return res.status(404).json({ error: 'Не найдено' })
    res.json(lesson)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.post('/', authenticate, requireTutor, async (req, res) => {
  try {
    const lesson = await prisma.lesson.create({ data: req.body })
    res.status(201).json(lesson)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.patch('/:id', authenticate, requireTutor, async (req, res) => {
  try {
    const lesson = await prisma.lesson.update({ where: { id: req.params.id }, data: req.body })
    res.json(lesson)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.delete('/:id', authenticate, requireTutor, async (req, res) => {
  try {
    await prisma.lesson.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

export default router
