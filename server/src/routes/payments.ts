import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireTutor, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    let payments
    if (req.user!.role === 'TUTOR') {
      payments = await prisma.payment.findMany({ include: { student: { include: { user: { select: { fullName: true } } } } }, orderBy: { createdAt: 'desc' } })
    } else {
      const student = await prisma.student.findUnique({ where: { userId: req.user!.id } })
      if (!student) return res.json([])
      payments = await prisma.payment.findMany({ where: { studentId: student.id }, orderBy: { createdAt: 'desc' } })
    }
    res.json(payments)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.post('/', authenticate, requireTutor, async (req, res) => {
  try {
    const payment = await prisma.payment.create({ data: req.body, include: { student: { include: { user: { select: { fullName: true } } } } } })
    res.status(201).json(payment)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.patch('/:id', authenticate, requireTutor, async (req, res) => {
  try {
    const payment = await prisma.payment.update({ where: { id: req.params.id }, data: req.body })
    res.json(payment)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.delete('/:id', authenticate, requireTutor, async (req, res) => {
  try {
    await prisma.payment.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

export default router
