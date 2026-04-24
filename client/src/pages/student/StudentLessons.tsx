import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { LessonStatusBadge } from '@/components/StatusBadge'
import api from '@/lib/api'
import { Lesson } from '@/types'
import { BookOpen } from 'lucide-react'
import { formatDate, formatMoney } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default function StudentLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/lessons').then(r => setLessons(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const upcoming = lessons.filter(l => l.status === 'SCHEDULED')
  const completed = lessons.filter(l => l.status === 'COMPLETED')

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Мои занятия" description={`Всего ${lessons.length} занятий`} />

      {lessons.length === 0 ? (
        <EmptyState icon={BookOpen} title="Нет занятий" description="Ваши занятия появятся здесь после того, как репетитор создаст их" />
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Предстоящие</h2>
              <div className="space-y-3">
                {upcoming.map(l => (
                  <Card key={l.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary leading-none">{new Date(l.date).getDate()}</span>
                          <span className="text-[10px] text-primary/70">{new Date(l.date).toLocaleDateString('ru-RU', { month: 'short' })}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{l.title}</p>
                          <p className="text-xs text-muted-foreground">{l.startTime}–{l.endTime} · {l.format === 'ONLINE' ? 'Онлайн' : 'Очно'}</p>
                        </div>
                        <LessonStatusBadge status={l.status} />
                      </div>
                      {l.description && <p className="mt-3 text-sm text-muted-foreground bg-slate-50 rounded-lg p-3">{l.description}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Прошедшие</h2>
              <div className="space-y-2">
                {completed.map(l => (
                  <Card key={l.id} className="opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-muted flex flex-col items-center justify-center shrink-0">
                          <span className="text-xs font-bold leading-none">{new Date(l.date).getDate()}</span>
                          <span className="text-[10px] text-muted-foreground">{new Date(l.date).toLocaleDateString('ru-RU', { month: 'short' })}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{l.title}</p>
                          <p className="text-xs text-muted-foreground">{l.startTime}–{l.endTime}</p>
                        </div>
                        <LessonStatusBadge status={l.status} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
