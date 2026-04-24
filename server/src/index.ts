import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import path from 'path'
import authRoutes from './routes/auth'
import applicationRoutes from './routes/applications'
import studentRoutes from './routes/students'
import lessonRoutes from './routes/lessons'
import homeworkRoutes from './routes/homework'
import materialRoutes from './routes/materials'
import paymentRoutes from './routes/payments'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const isProd = process.env.NODE_ENV === 'production'

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({
  origin: isProd ? true : 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

app.use('/api/auth', authRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/homework', homeworkRoutes)
app.use('/api/materials', materialRoutes)
app.use('/api/payments', paymentRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

// Serve React app in production
if (isProd) {
  const clientDist = path.join(__dirname, '../../client/dist')
  app.use(express.static(clientDist))
  app.get('*', (_, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
