import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireTutor, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    let hw
    if (req.user!.role === 'TUTOR') {
      hw = await prisma.homework.findMany({ include: { student: { include: { user: { select: { fullName: true } } } } }, orderBy: { createdAt: 'desc' } })
    } else {
      const student = await prisma.student.findUnique({ where: { userId: req.user!.id } })
      if (!student) return res.json([])
      hw = await prisma.homework.findMany({ where: { studentId: student.id }, orderBy: { createdAt: 'desc' } })
    }
    res.json(hw)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const hw = await prisma.homework.findUnique({ where: { id: req.params.id }, include: { student: { include: { user: true } }, lesson: true } })
    if (!hw) return res.status(404).json({ error: 'Не найдено' })
    res.json(hw)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.post('/', authenticate, requireTutor, async (req, res) => {
  try {
    const hw = await prisma.homework.create({ data: req.body })
    res.status(201).json(hw)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.patch('/:id', authenticate, async (req, res) => {
  try {
    const hw = await prisma.homework.update({ where: { id: req.params.id }, data: req.body })
    res.json(hw)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.delete('/:id', authenticate, requireTutor, async (req, res) => {
  try {
    await prisma.homework.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

export default router
