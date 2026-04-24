import { Badge } from '@/components/ui/badge'
import { ApplicationStatus, HomeworkStatus, LessonStatus, PaymentStatus } from '@/types'

const appStatusMap: Record<ApplicationStatus, { label: string; variant: 'default' | 'info' | 'success' | 'destructive' | 'warning' | 'secondary' | 'outline' }> = {
  NEW: { label: 'Новая', variant: 'info' },
  IN_PROGRESS: { label: 'В работе', variant: 'warning' },
  APPROVED: { label: 'Одобрена', variant: 'success' },
  REJECTED: { label: 'Отклонена', variant: 'destructive' },
}

const lessonStatusMap: Record<LessonStatus, { label: string; variant: 'default' | 'info' | 'success' | 'destructive' | 'warning' | 'secondary' | 'outline' }> = {
  SCHEDULED: { label: 'Запланировано', variant: 'info' },
  COMPLETED: { label: 'Завершено', variant: 'success' },
  CANCELLED: { label: 'Отменено', variant: 'destructive' },
}

const hwStatusMap: Record<HomeworkStatus, { label: string; variant: 'default' | 'info' | 'success' | 'destructive' | 'warning' | 'secondary' | 'outline' }> = {
  ASSIGNED: { label: 'Выдано', variant: 'warning' },
  SUBMITTED: { label: 'Сдано', variant: 'info' },
  REVIEWED: { label: 'Проверено', variant: 'success' },
}

const payStatusMap: Record<PaymentStatus, { label: string; variant: 'default' | 'info' | 'success' | 'destructive' | 'warning' | 'secondary' | 'outline' }> = {
  PENDING: { label: 'Ожидается', variant: 'warning' },
  PAID: { label: 'Оплачено', variant: 'success' },
  OVERDUE: { label: 'Просрочено', variant: 'destructive' },
}

export function AppStatusBadge({ status }: { status: ApplicationStatus }) {
  const { label, variant } = appStatusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function LessonStatusBadge({ status }: { status: LessonStatus }) {
  const { label, variant } = lessonStatusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function HwStatusBadge({ status }: { status: HomeworkStatus }) {
  const { label, variant } = hwStatusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function PayStatusBadge({ status }: { status: PaymentStatus }) {
  const { label, variant } = payStatusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}
