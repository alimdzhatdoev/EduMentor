import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import api from '@/lib/api'
import { Student, Lesson, Payment, Application } from '@/types'
import { Users, BookOpen, CreditCard, ClipboardList, TrendingUp, ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import { formatMoney } from '@/lib/utils'
import { LessonStatusBadge, PayStatusBadge } from '@/components/StatusBadge'
import { Link } from 'react-router-dom'

export default function DashboardHome() {
  const [students, setStudents] = useState<Student[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/students'),
      api.get('/lessons'),
      api.get('/payments'),
      api.get('/applications'),
    ]).then(([s, l, p, a]) => {
      setStudents(s.data)
      setLessons(l.data)
      setPayments(p.data)
      setApplications(a.data)
    }).finally(() => setLoading(false))
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingLessons = lessons
    .filter(l => l.status === 'SCHEDULED' && new Date(l.date) >= today)
    .slice(0, 5)

  const todayLessons = lessons.filter(l => {
    const d = new Date(l.date)
    d.setHours(0, 0, 0, 0)
    return d.getTime() === today.getTime()
  })

  const newApps = applications.filter(a => a.status === 'NEW').length
  const completedLessons = lessons.filter(l => l.status === 'COMPLETED').length
  const totalIncome = payments.filter(p => p.status === 'PAID').reduce((s, p) => s + p.amount, 0)
  const pending = payments.filter(p => p.status === 'PENDING').reduce((s, p) => s + p.amount, 0)

  const stats = [
    {
      label: 'Учеников',
      value: students.length,
      sub: 'активных',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      link: '/dashboard/students',
    },
    {
      label: 'Проведено занятий',
      value: completedLessons,
      sub: `из ${lessons.length} всего`,
      icon: CheckCircle2,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
      link: '/dashboard/lessons',
    },
    {
      label: 'Получено',
      value: formatMoney(totalIncome),
      sub: 'оплачено',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      link: '/dashboard/payments',
    },
    {
      label: 'Новых заявок',
      value: newApps,
      sub: 'ждут ответа',
      icon: ClipboardList,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      link: '/dashboard/applications',
    },
  ]

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Обзор</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Актуальная информация о вашей работе</p>
        </div>
        {todayLessons.length > 0 && (
          <Badge variant="secondary" className="gap-1.5 text-xs">
            <Clock className="h-3 w-3" />
            Сегодня {todayLessons.length} {todayLessons.length === 1 ? 'занятие' : 'занятия'}
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Link key={s.label} to={s.link}>
            <Card className={`border hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer ${s.border}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Upcoming lessons */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Ближайшие занятия</CardTitle>
            <Link to="/dashboard/schedule" className="text-xs text-primary hover:underline flex items-center gap-1">
              Расписание <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingLessons.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Нет предстоящих занятий</p>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingLessons.map(l => {
                  const date = new Date(l.date)
                  const isToday = (() => {
                    const d = new Date(l.date)
                    d.setHours(0, 0, 0, 0)
                    return d.getTime() === today.getTime()
                  })()
                  return (
                    <div key={l.id} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isToday ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50 hover:bg-slate-100'}`}>
                      <div className={`h-10 w-10 rounded-lg flex flex-col items-center justify-center shrink-0 ${isToday ? 'bg-primary text-white' : 'bg-white border'}`}>
                        <span className="text-xs font-bold leading-none">{date.getDate()}</span>
                        <span className="text-[9px] opacity-70 mt-0.5">
                          {date.toLocaleDateString('ru-RU', { month: 'short' })}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{l.title}</p>
                          {isToday && <Badge className="text-[10px] h-4 px-1.5 bg-primary shrink-0">Сегодня</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {l.student?.user?.fullName} · {l.startTime}–{l.endTime}
                        </p>
                      </div>
                      <LessonStatusBadge status={l.status} />
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Finances */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Финансы</CardTitle>
            <Link to="/dashboard/payments" className="text-xs text-primary hover:underline flex items-center gap-1">
              Все <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div>
                  <p className="text-xs text-emerald-600 font-medium">Получено</p>
                  <p className="text-lg font-bold text-emerald-700">{formatMoney(totalIncome)}</p>
                </div>
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div>
                  <p className="text-xs text-amber-600 font-medium">Ожидается</p>
                  <p className="text-lg font-bold text-amber-700">{formatMoney(pending)}</p>
                </div>
                <CreditCard className="h-5 w-5 text-amber-400" />
              </div>
            </div>

            {payments.filter(p => p.status !== 'PAID').length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2">Ожидают оплаты</p>
                <div className="space-y-2">
                  {payments.filter(p => p.status !== 'PAID').slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 truncate max-w-[100px]">{p.student?.user?.fullName}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-semibold">{formatMoney(p.amount)}</span>
                        <PayStatusBadge status={p.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* New applications alert */}
      {newApps > 0 && (
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <ClipboardList className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-amber-900">
                  {newApps} {newApps === 1 ? 'новая заявка' : newApps < 5 ? 'новых заявки' : 'новых заявок'}
                </p>
                <p className="text-xs text-amber-700 mt-0.5">Потенциальные ученики ждут вашего ответа</p>
              </div>
            </div>
            <Link to="/dashboard/applications">
              <button className="text-sm font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1.5 bg-white/60 hover:bg-white px-3 py-1.5 rounded-lg transition-colors border border-amber-200">
                Просмотреть <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
