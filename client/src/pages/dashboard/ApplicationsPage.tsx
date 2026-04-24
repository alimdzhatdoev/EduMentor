import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { AppStatusBadge } from '@/components/StatusBadge'
import api from '@/lib/api'
import { Application, ApplicationStatus } from '@/types'
import { ClipboardList, Phone, Mail, Clock, BookOpen } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: 'NEW', label: 'Новая' },
  { value: 'IN_PROGRESS', label: 'В работе' },
  { value: 'APPROVED', label: 'Одобрена' },
  { value: 'REJECTED', label: 'Отклонена' },
]

const filterOptions = ['Все', 'Новые', 'В работе', 'Одобрена', 'Отклонена']
const filterMap: Record<string, ApplicationStatus | undefined> = {
  'Все': undefined, 'Новые': 'NEW', 'В работе': 'IN_PROGRESS', 'Одобрена': 'APPROVED', 'Отклонена': 'REJECTED'
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Все')

  useEffect(() => {
    api.get('/applications').then(r => setApps(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = apps.filter(a => !filterMap[filter] || a.status === filterMap[filter])

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    const updated = await api.patch(`/applications/${id}`, { status })
    setApps(prev => prev.map(a => a.id === id ? updated.data : a))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Заявки" description={`Всего ${apps.length} заявок`} />

      <div className="flex gap-2 flex-wrap">
        {filterOptions.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            {f} {f === 'Новые' && apps.filter(a => a.status === 'NEW').length > 0 && `(${apps.filter(a => a.status === 'NEW').length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Нет заявок" description="Заявки появятся здесь после заполнения формы на сайте" />
      ) : (
        <div className="grid gap-4">
          {filtered.map(app => (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{app.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{app.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(app.createdAt)}</p>
                      </div>
                      <AppStatusBadge status={app.status} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />{app.phone}
                      </div>
                      {app.email && <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" />{app.email}</div>}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5" />{app.subject} · {app.level}
                      </div>
                      {app.preferredTime && <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-3.5 w-3.5" />{app.preferredTime}</div>}
                    </div>
                    {app.message && <p className="mt-3 text-sm bg-slate-50 rounded-lg p-3 text-muted-foreground">"{app.message}"</p>}
                  </div>
                  <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                    {statusOptions.filter(s => s.value !== app.status).slice(0, 2).map(s => (
                      <Button key={s.value} size="sm" variant="outline" onClick={() => updateStatus(app.id, s.value)}>
                        {s.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
