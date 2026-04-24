import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { HwStatusBadge } from '@/components/StatusBadge'
import api from '@/lib/api'
import { Homework } from '@/types'
import { FileText, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function StudentHomework() {
  const [homework, setHomework] = useState<Homework[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/homework').then(r => setHomework(r.data)).finally(() => setLoading(false))
  }, [])

  const submit = async (id: string) => {
    const r = await api.patch(`/homework/${id}`, { status: 'SUBMITTED' })
    setHomework(prev => prev.map(h => h.id === id ? r.data : h))
  }

  if (loading) return <LoadingSpinner />

  const active = homework.filter(h => h.status === 'ASSIGNED')
  const submitted = homework.filter(h => h.status === 'SUBMITTED')
  const reviewed = homework.filter(h => h.status === 'REVIEWED')

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Домашние задания" description={`Активных: ${active.length}`} />

      {homework.length === 0 ? (
        <EmptyState icon={FileText} title="Нет домашних заданий" description="Задания появятся здесь после занятия" />
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">К выполнению</h2>
              <div className="space-y-3">
                {active.map(hw => (
                  <Card key={hw.id} className="border-l-4 border-l-amber-400">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold mb-1">{hw.title}</p>
                          {hw.description && <p className="text-sm text-muted-foreground leading-relaxed">{hw.description}</p>}
                          {hw.dueDate && (
                            <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              Срок: {formatDate(hw.dueDate)}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <HwStatusBadge status={hw.status} />
                          <Button size="sm" variant="outline" onClick={() => submit(hw.id)}>Сдать</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {submitted.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Сдано на проверку</h2>
              <div className="space-y-2">
                {submitted.map(hw => (
                  <Card key={hw.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <p className="text-sm font-medium">{hw.title}</p>
                      <HwStatusBadge status={hw.status} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {reviewed.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Проверено</h2>
              <div className="space-y-2">
                {reviewed.map(hw => (
                  <Card key={hw.id} className="opacity-70">
                    <CardContent className="p-4 flex items-center justify-between">
                      <p className="text-sm font-medium">{hw.title}</p>
                      <HwStatusBadge status={hw.status} />
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
