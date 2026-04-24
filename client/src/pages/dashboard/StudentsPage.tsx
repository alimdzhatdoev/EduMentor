import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import api from '@/lib/api'
import { Student } from '@/types'
import { Users, Phone, BookOpen, Plus, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', subject: '', level: '', notes: '', password: 'student123' })

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = students.filter(s =>
    s.user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.subject.toLowerCase().includes(search.toLowerCase())
  )

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/students', form)
      const r = await api.get('/students')
      setStudents(r.data)
      setOpen(false)
      setForm({ fullName: '', email: '', phone: '', subject: '', level: '', notes: '', password: 'student123' })
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ошибка')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Ученики"
        description={`${students.length} учеников`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Добавить</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Добавить ученика</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-2">
                <div><Label>Имя *</Label><Input className="mt-1" value={form.fullName} onChange={e => set('fullName', e.target.value)} required /></div>
                <div><Label>Email *</Label><Input className="mt-1" type="email" value={form.email} onChange={e => set('email', e.target.value)} required /></div>
                <div><Label>Телефон</Label><Input className="mt-1" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Предмет *</Label><Input className="mt-1" value={form.subject} onChange={e => set('subject', e.target.value)} required /></div>
                  <div><Label>Уровень *</Label><Input className="mt-1" placeholder="9 класс" value={form.level} onChange={e => set('level', e.target.value)} required /></div>
                </div>
                <div><Label>Заметки</Label><Textarea className="mt-1" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
                <div><Label>Пароль</Label><Input className="mt-1" value={form.password} onChange={e => set('password', e.target.value)} /></div>
                <Button type="submit" className="w-full">Добавить ученика</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Поиск по имени или предмету..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="Ученики не найдены" description="Добавьте первого ученика или измените запрос поиска" />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(s => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-white">{s.user.fullName[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{s.user.fullName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{s.subject}</Badge>
                      <span className="text-xs text-muted-foreground">{s.level}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5">
                  {s.user.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />{s.user.phone}
                    </div>
                  )}
                  {s.notes && <p className="text-xs text-muted-foreground bg-slate-50 rounded-lg p-2 mt-2 leading-relaxed">{s.notes}</p>}
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span>С {formatDate(s.createdAt)}</span>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{s.lessons?.length ?? 0} занятий</span>
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
