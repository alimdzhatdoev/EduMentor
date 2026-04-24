import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { HwStatusBadge } from '@/components/StatusBadge'
import api from '@/lib/api'
import { Homework, Student } from '@/types'
import { FileText, Plus, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function HomeworkPage() {
  const [homework, setHomework] = useState<Homework[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ studentId: '', title: '', description: '', dueDate: '' })

  useEffect(() => {
    Promise.all([api.get('/homework'), api.get('/students')]).then(([h, s]) => {
      setHomework(h.data); setStudents(s.data)
    }).finally(() => setLoading(false))
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/homework', { ...form, dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null })
      const r = await api.get('/homework')
      setHomework(r.data)
      setOpen(false)
      setForm({ studentId: '', title: '', description: '', dueDate: '' })
    } catch (err: any) { alert(err.response?.data?.error || 'Ошибка') }
  }

  const updateStatus = async (id: string, status: string) => {
    const r = await api.patch(`/homework/${id}`, { status })
    setHomework(prev => prev.map(h => h.id === id ? r.data : h))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Домашние задания"
        description={`Всего ${homework.length}`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />Добавить ДЗ</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Новое домашнее задание</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-2">
                <div>
                  <Label>Ученик *</Label>
                  <Select onValueChange={v => set('studentId', v)} required>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Выберите ученика" /></SelectTrigger>
                    <SelectContent>
                      {students.map(s => <SelectItem key={s.id} value={s.id}>{s.user.fullName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Название *</Label><Input className="mt-1" value={form.title} onChange={e => set('title', e.target.value)} required /></div>
                <div><Label>Описание</Label><Textarea className="mt-1" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Подробное описание задания..." /></div>
                <div><Label>Срок сдачи</Label><Input className="mt-1" type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} /></div>
                <Button type="submit" className="w-full">Добавить</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {homework.length === 0 ? (
        <EmptyState icon={FileText} title="Нет домашних заданий" />
      ) : (
        <div className="space-y-3">
          {homework.map(hw => (
            <Card key={hw.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{hw.title}</p>
                      <HwStatusBadge status={hw.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{hw.student?.user?.fullName}</p>
                    {hw.description && <p className="text-sm text-muted-foreground bg-slate-50 rounded-lg p-2">{hw.description}</p>}
                    {hw.dueDate && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Срок: {formatDate(hw.dueDate)}
                      </div>
                    )}
                  </div>
                  {hw.status === 'SUBMITTED' && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(hw.id, 'REVIEWED')}>Проверено</Button>
                  )}
                  {hw.status === 'ASSIGNED' && (
                    <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => updateStatus(hw.id, 'SUBMITTED')}>Отметить сданным</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
