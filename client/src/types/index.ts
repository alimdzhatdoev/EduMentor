export type Role = 'TUTOR' | 'STUDENT'

export interface User {
  id: string
  fullName: string
  email: string
  phone?: string
  role: Role
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export type ApplicationStatus = 'NEW' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED'

export interface Application {
  id: string
  name: string
  phone: string
  email?: string
  subject: string
  level: string
  preferredTime?: string
  message?: string
  status: ApplicationStatus
  createdAt: string
}

export interface Student {
  id: string
  userId: string
  user: Pick<User, 'fullName' | 'email' | 'phone' | 'avatarUrl'>
  subject: string
  level: string
  notes?: string
  createdAt: string
  updatedAt: string
  lessons?: Lesson[]
  payments?: Payment[]
}

export type LessonStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
export type LessonFormat = 'ONLINE' | 'OFFLINE'

export interface Lesson {
  id: string
  studentId: string
  student?: { user: { fullName: string } }
  title: string
  description?: string
  date: string
  startTime: string
  endTime: string
  format: LessonFormat
  status: LessonStatus
  price: number
  comment?: string
  createdAt: string
  updatedAt: string
}

export type HomeworkStatus = 'ASSIGNED' | 'SUBMITTED' | 'REVIEWED'

export interface Homework {
  id: string
  studentId: string
  student?: { user: { fullName: string } }
  lessonId?: string
  title: string
  description?: string
  dueDate?: string
  status: HomeworkStatus
  createdAt: string
  updatedAt: string
}

export type MaterialType = 'DOCUMENT' | 'VIDEO' | 'LINK' | 'IMAGE'

export interface Material {
  id: string
  title: string
  description?: string
  type: MaterialType
  url?: string
  fileUrl?: string
  studentId?: string
  subject?: string
  createdAt: string
  updatedAt: string
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE'

export interface Payment {
  id: string
  studentId: string
  student?: { user: { fullName: string } }
  amount: number
  paymentDate?: string
  status: PaymentStatus
  comment?: string
  createdAt: string
}
