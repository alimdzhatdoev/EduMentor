import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireTutor, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    let materials
    if (req.user!.role === 'TUTOR') {
      materials = await prisma.material.findMany({ orderBy: { createdAt: 'desc' } })
    } else {
      const student = await prisma.student.findUnique({ where: { userId: req.user!.id } })
      if (!student) return res.json([])
      materials = await prisma.material.findMany({ where: { OR: [{ studentId: student.id }, { studentId: null }] }, orderBy: { createdAt: 'desc' } })
    }
    res.json(materials)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const m = await prisma.material.findUnique({ where: { id: req.params.id } })
    if (!m) return res.status(404).json({ error: 'Не найдено' })
    res.json(m)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.post('/', authenticate, requireTutor, async (req, res) => {
  try {
    const m = await prisma.material.create({ data: req.body })
    res.status(201).json(m)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.patch('/:id', authenticate, requireTutor, async (req, res) => {
  try {
    const m = await prisma.material.update({ where: { id: req.params.id }, data: req.body })
    res.json(m)
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

router.delete('/:id', authenticate, requireTutor, async (req, res) => {
  try {
    await prisma.material.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch { res.status(500).json({ error: 'Ошибка сервера' }) }
})

export default router
