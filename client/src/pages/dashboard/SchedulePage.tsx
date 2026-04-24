import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/PageHeader'
import api from '@/lib/api'
import { Lesson } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LessonStatusBadge } from '@/components/StatusBadge'
import { cn } from '@/lib/utils'

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

function getWeekDates(date: Date): Date[] {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return Array.from({ length: 7 }, (_, i) => {
    const nd = new Date(d)
    nd.setDate(d.getDate() + i)
    return nd
  })
}

export default function SchedulePage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const week = getWeekDates(currentDate)

  useEffect(() => {
    api.get('/lessons').then(r => setLessons(r.data))
  }, [])

  const prevWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d) }
  const nextWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d) }

  const getLessonsForDay = (date: Date) => {
    return lessons.filter(l => {
      const ld = new Date(l.date)
      return ld.getDate() === date.getDate() && ld.getMonth() === date.getMonth() && ld.getFullYear() === date.getFullYear()
    }).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const today = new Date()

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Расписание" description="Еженедельный обзор занятий" />

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {MONTHS[week[0].getMonth()]} {week[0].getFullYear()}
              {week[0].getMonth() !== week[6].getMonth() && ` — ${MONTHS[week[6].getMonth()]}`}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevWeek}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Сегодня</Button>
              <Button variant="outline" size="icon" onClick={nextWeek}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-7 gap-2">
            {DAYS.map((d, i) => {
              const date = week[i]
              const isToday = date.toDateString() === today.toDateString()
              const dayLessons = getLessonsForDay(date)
              return (
                <div key={d} className="min-h-[160px]">
                  <div className={cn('text-center mb-2 py-2 rounded-xl', isToday ? 'bg-primary text-white' : 'bg-muted')}>
                    <p className="text-xs font-medium">{d}</p>
                    <p className={cn('text-lg font-bold leading-none mt-0.5', isToday ? 'text-white' : '')}>{date.getDate()}</p>
                  </div>
                  <div className="space-y-1.5">
                    {dayLessons.map(l => (
                      <div key={l.id} className={cn('p-2 rounded-lg text-xs cursor-pointer hover:opacity-90 transition-opacity',
                        l.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                        l.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-indigo-100 text-indigo-800')}>
                        <p className="font-semibold">{l.startTime}</p>
                        <p className="truncate mt-0.5">{l.student?.user?.fullName || l.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day details */}
      {week.map((date, i) => {
        const dayLessons = getLessonsForDay(date)
        if (dayLessons.length === 0) return null
        return (
          <Card key={i}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {DAYS[i]}, {date.getDate()} {MONTHS[date.getMonth()].toLowerCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dayLessons.map(l => (
                  <div key={l.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <div className="text-sm font-mono font-medium w-20 shrink-0">{l.startTime}–{l.endTime}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{l.title}</p>
                      <p className="text-xs text-muted-foreground">{l.student?.user?.fullName}</p>
                    </div>
                    <LessonStatusBadge status={l.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
