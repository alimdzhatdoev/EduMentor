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
import api from '@/lib/api'
import { Material, Student, MaterialType } from '@/types'
import { Package, Plus, FileText, Video, Link2, Image, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const typeIcons: Record<MaterialType, React.ElementType> = {
  DOCUMENT: FileText, VIDEO: Video, LINK: Link2, IMAGE: Image
}

const typeLabels: Record<MaterialType, string> = {
  DOCUMENT: 'Документ', VIDEO: 'Видео', LINK: 'Ссылка', IMAGE: 'Изображение'
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', type: 'DOCUMENT', url: '', subject: '', studentId: '' })

  useEffect(() => {
    Promise.all([api.get('/materials'), api.get('/students')]).then(([m, s]) => {
      setMaterials(m.data); setStudents(s.data)
    }).finally(() => setLoading(false))
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/materials', { ...form, studentId: form.studentId || null })
      const r = await api.get('/materials')
      setMaterials(r.data)
      setOpen(false)
    } catch (err: any) { alert(err.response?.data?.error || 'Ошибка') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить материал?')) return
    await api.delete(`/materials/${id}`)
    setMaterials(prev => prev.filter(m => m.id !== id))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Материалы"
        description={`${materials.length} материалов`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />Добавить</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Новый материал</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-2">
                <div><Label>Название *</Label><Input className="mt-1" value={form.title} onChange={e => set('title', e.target.value)} required /></div>
                <div><Label>Описание</Label><Textarea className="mt-1" rows={2} value={form.description} onChange={e => set('description', e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Тип</Label>
                    <Select defaultValue="DOCUMENT" onValueChange={v => set('type', v)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DOCUMENT">Документ</SelectItem>
                        <SelectItem value="LINK">Ссылка</SelectItem>
                        <SelectItem value="VIDEO">Видео</SelectItem>
                        <SelectItem value="IMAGE">Изображение</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Предмет</Label><Input className="mt-1" placeholder="Математика" value={form.subject} onChange={e => set('subject', e.target.value)} /></div>
                </div>
                <div><Label>URL / Ссылка</Label><Input className="mt-1" placeholder="https://..." value={form.url} onChange={e => set('url', e.target.value)} /></div>
                <div>
                  <Label>Ученик (если личный)</Label>
                  <Select onValueChange={v => set('studentId', v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Общий (для всех)" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Общий</SelectItem>
                      {students.map(s => <SelectItem key={s.id} value={s.id}>{s.user.fullName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Добавить</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {materials.length === 0 ? (
        <EmptyState icon={Package} title="Нет материалов" description="Добавьте учебные материалы для учеников" />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {materials.map(m => {
            const Icon = typeIcons[m.type]
            return (
              <Card key={m.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{m.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{typeLabels[m.type]}</Badge>
                        {m.subject && <span className="text-xs text-muted-foreground">{m.subject}</span>}
                      </div>
                    </div>
                  </div>
                  {m.description && <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{m.description}</p>}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{m.studentId ? 'Личный' : 'Общий'}</span>
                    <div className="flex gap-2">
                      {m.url && (
                        <a href={m.url} target="_blank" rel="noreferrer">
                          <Button size="sm" variant="ghost" className="h-7 text-xs"><ExternalLink className="h-3 w-3 mr-1" />Открыть</Button>
                        </a>
                      )}
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500 hover:text-red-700" onClick={() => handleDelete(m.id)}>Удалить</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
