import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HwStatusBadge, LessonStatusBadge, PayStatusBadge } from '@/components/StatusBadge'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import api from '@/lib/api'
import { Lesson, Homework, Payment } from '@/types'
import { BookOpen, FileText, CreditCard, Calendar, ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import { formatDate, formatMoney } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function StudentHome() {
  const { user } = useAuthStore()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [homework, setHomework] = useState<Homework[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/lessons'),
      api.get('/homework'),
      api.get('/payments'),
    ]).then(([l, h, p]) => {
      setLessons(l.data)
      setHomework(h.data)
      setPayments(p.data)
    }).finally(() => setLoading(false))
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingLessons = lessons.filter(l => l.status === 'SCHEDULED' && new Date(l.date) >= today)
  const nextLesson = upcomingLessons[0] ?? null
  const completedLessons = lessons.filter(l => l.status === 'COMPLETED').length
  const pendingHw = homework.filter(h => h.status === 'ASSIGNED')
  const reviewedHw = homework.filter(h => h.status === 'REVIEWED').length
  const totalPaid = payments.filter(p => p.status === 'PAID').reduce((s, p) => s + p.amount, 0)

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Привет, {user?.fullName?.split(' ')[0]}!
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Ваш личный кабинет ученика</p>
      </div>

      {/* Next lesson banner */}
      {nextLesson ? (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-5 flex items-center justify-between shadow-lg shadow-indigo-200">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex flex-col items-center justify-center shrink-0">
              <span className="text-xl font-bold leading-none">{new Date(nextLesson.date).getDate()}</span>
              <span className="text-xs opacity-80 mt-0.5">
                {new Date(nextLesson.date).toLocaleDateString('ru-RU', { month: 'short' })}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium opacity-75 mb-0.5 uppercase tracking-wide">Следующее занятие</p>
              <p className="font-bold text-lg leading-tight">{nextLesson.title}</p>
              <p className="text-sm opacity-80 mt-0.5">
                {nextLesson.startTime}–{nextLesson.endTime} · {nextLesson.format === 'ONLINE' ? 'Онлайн' : 'Очно'}
              </p>
            </div>
          </div>
          <Link to="/student/schedule" className="flex items-center gap-1.5 text-sm font-medium bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl shrink-0">
            Расписание <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-100 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-200 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-slate-400" />
          </div>
          <div>
            <p className="font-medium text-slate-700">Нет предстоящих занятий</p>
            <p className="text-sm text-slate-500">Ваш репетитор скоро добавит расписание</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Пройдено занятий',
            value: completedLessons,
            sub: `из ${lessons.length}`,
            icon: CheckCircle2,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
            link: '/student/lessons',
          },
          {
            label: 'Предстоит',
            value: upcomingLessons.length,
            sub: 'запланировано',
            icon: Calendar,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            link: '/student/schedule',
          },
          {
            label: 'Активных заданий',
            value: pendingHw.length,
            sub: `проверено: ${reviewedHw}`,
            icon: FileText,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            link: '/student/homework',
          },
          {
            label: 'Оплачено',
            value: formatMoney(totalPaid),
            sub: `${payments.length} платежей`,
            icon: CreditCard,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            link: '#',
          },
        ].map(s => (
          <Link key={s.label} to={s.link}>
            <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="p-5">
                <div className={`h-9 w-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming lessons */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Ближайшие занятия</CardTitle>
            <Link to="/student/schedule" className="text-xs text-primary hover:underline flex items-center gap-1">
              Все <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingLessons.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <BookOpen className="h-7 w-7 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Нет предстоящих занятий</p>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingLessons.slice(0, 3).map(l => {
                  const isToday = (() => {
                    const d = new Date(l.date); d.setHours(0, 0, 0, 0)
                    return d.getTime() === today.getTime()
                  })()
                  return (
                    <div key={l.id} className={`flex items-center gap-3 p-3 rounded-xl ${isToday ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50'}`}>
                      <div className={`h-9 w-9 rounded-lg flex flex-col items-center justify-center shrink-0 ${isToday ? 'bg-primary text-white' : 'bg-white border'}`}>
                        <span className="text-xs font-bold leading-none">{new Date(l.date).getDate()}</span>
                        <span className="text-[9px] opacity-70 mt-0.5">
                          {new Date(l.date).toLocaleDateString('ru-RU', { month: 'short' })}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium truncate">{l.title}</p>
                          {isToday && <Badge className="text-[10px] h-4 px-1.5 bg-primary shrink-0">Сегодня</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{l.startTime}–{l.endTime} · {l.format === 'ONLINE' ? 'Онлайн' : 'Очно'}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Homework */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Домашние задания</CardTitle>
            <Link to="/student/homework" className="text-xs text-primary hover:underline flex items-center gap-1">
              Все <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {pendingHw.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle2 className="h-7 w-7 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Все задания выполнены!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingHw.slice(0, 3).map(hw => {
                  const isOverdue = hw.dueDate && new Date(hw.dueDate) < new Date()
                  return (
                    <div key={hw.id} className={`flex items-start gap-3 p-3 rounded-xl ${isOverdue ? 'bg-red-50 border border-red-100' : 'bg-slate-50'}`}>
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${isOverdue ? 'bg-red-100' : 'bg-amber-100'}`}>
                        <FileText className={`h-4 w-4 ${isOverdue ? 'text-red-500' : 'text-amber-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{hw.title}</p>
                        {hw.dueDate && (
                          <div className={`flex items-center gap-1 mt-0.5 text-xs ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                            <Clock className="h-3 w-3" />
                            {isOverdue ? 'Просрочено: ' : 'Срок: '}
                            {formatDate(hw.dueDate)}
                          </div>
                        )}
                      </div>
                      <HwStatusBadge status={hw.status} />
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent payments */}
      {payments.length > 0 && (
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">История оплат</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {payments.slice(0, 3).map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{formatMoney(p.amount)}</p>
                    {p.comment && <p className="text-xs text-muted-foreground">{p.comment}</p>}
                    {p.paymentDate && <p className="text-xs text-muted-foreground">{formatDate(p.paymentDate)}</p>}
                  </div>
                  <PayStatusBadge status={p.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
