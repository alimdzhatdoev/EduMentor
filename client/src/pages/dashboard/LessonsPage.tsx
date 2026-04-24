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
import { LessonStatusBadge } from '@/components/StatusBadge'
import api from '@/lib/api'
import { Lesson, Student } from '@/types'
import { BookOpen, Plus, Calendar } from 'lucide-react'
import { formatDate, formatMoney } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ studentId: '', title: '', description: '', date: '', startTime: '', endTime: '', format: 'ONLINE', price: '5000', comment: '' })

  useEffect(() => {
    Promise.all([api.get('/lessons'), api.get('/students')]).then(([l, s]) => {
      setLessons(l.data); setStudents(s.data)
    }).finally(() => setLoading(false))
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/lessons', { ...form, price: Number(form.price), date: new Date(form.date).toISOString() })
      const r = await api.get('/lessons')
      setLessons(r.data)
      setOpen(false)
    } catch (err: any) { alert(err.response?.data?.error || 'Ошибка') }
  }

  const updateStatus = async (id: string, status: string) => {
    const r = await api.patch(`/lessons/${id}`, { status })
    setLessons(prev => prev.map(l => l.id === id ? r.data : l))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Занятия"
        description={`Всего ${lessons.length} занятий`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />Новое занятие</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Создать занятие</DialogTitle></DialogHeader>
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
                <div><Label>Тема *</Label><Input className="mt-1" value={form.title} onChange={e => set('title', e.target.value)} required /></div>
                <div><Label>Описание</Label><Textarea className="mt-1" rows={2} value={form.description} onChange={e => set('description', e.target.value)} /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Дата *</Label><Input className="mt-1" type="date" value={form.date} onChange={e => set('date', e.target.value)} required /></div>
                  <div><Label>Начало</Label><Input className="mt-1" type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} /></div>
                  <div><Label>Конец</Label><Input className="mt-1" type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Формат</Label>
                    <Select defaultValue="ONLINE" onValueChange={v => set('format', v)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ONLINE">Онлайн</SelectItem>
                        <SelectItem value="OFFLINE">Очно</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Цена (₽)</Label><Input className="mt-1" type="number" value={form.price} onChange={e => set('price', e.target.value)} /></div>
                </div>
                <Button type="submit" className="w-full">Создать занятие</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {lessons.length === 0 ? (
        <EmptyState icon={BookOpen} title="Нет занятий" description="Создайте первое занятие" />
      ) : (
        <div className="space-y-3">
          {lessons.map(l => (
            <Card key={l.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary leading-none">{new Date(l.date).getDate()}</span>
                    <span className="text-[10px] text-primary/70">{new Date(l.date).toLocaleDateString('ru-RU', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{l.title}</p>
                      <LessonStatusBadge status={l.status} />
                      <Badge variant="outline" className="text-xs">{l.format === 'ONLINE' ? 'Онлайн' : 'Очно'}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {l.student?.user?.fullName} · {l.startTime}–{l.endTime} · {formatMoney(l.price)}
                    </p>
                  </div>
                  {l.status === 'SCHEDULED' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => updateStatus(l.id, 'COMPLETED')}>Завершено</Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateStatus(l.id, 'CANCELLED')}>Отменить</Button>
                    </div>
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
