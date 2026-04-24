import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { PayStatusBadge } from '@/components/StatusBadge'
import api from '@/lib/api'
import { Payment, Student, PaymentStatus } from '@/types'
import { CreditCard, Plus, TrendingUp } from 'lucide-react'
import { formatDate, formatMoney } from '@/lib/utils'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ studentId: '', amount: '', comment: '', paymentDate: '', status: 'PENDING' })

  useEffect(() => {
    Promise.all([api.get('/payments'), api.get('/students')]).then(([p, s]) => {
      setPayments(p.data); setStudents(s.data)
    }).finally(() => setLoading(false))
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/payments', { ...form, amount: Number(form.amount), paymentDate: form.paymentDate ? new Date(form.paymentDate).toISOString() : null })
      const r = await api.get('/payments')
      setPayments(r.data)
      setOpen(false)
    } catch (err: any) { alert(err.response?.data?.error || 'Ошибка') }
  }

  const updateStatus = async (id: string, status: PaymentStatus) => {
    const data: any = { status }
    if (status === 'PAID') data.paymentDate = new Date().toISOString()
    const r = await api.patch(`/payments/${id}`, data)
    setPayments(prev => prev.map(p => p.id === id ? r.data : p))
  }

  const total = payments.filter(p => p.status === 'PAID').reduce((s, p) => s + p.amount, 0)
  const pending = payments.filter(p => p.status === 'PENDING').reduce((s, p) => s + p.amount, 0)
  const overdue = payments.filter(p => p.status === 'OVERDUE').reduce((s, p) => s + p.amount, 0)

  if (loading) return <LoadingSpinner />

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Оплаты"
        description="Учёт финансов"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />Добавить</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Новая запись об оплате</DialogTitle></DialogHeader>
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
                <div><Label>Сумма (₽) *</Label><Input className="mt-1" type="number" value={form.amount} onChange={e => set('amount', e.target.value)} required /></div>
                <div>
                  <Label>Статус</Label>
                  <Select defaultValue="PENDING" onValueChange={v => set('status', v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Ожидается</SelectItem>
                      <SelectItem value="PAID">Оплачено</SelectItem>
                      <SelectItem value="OVERDUE">Просрочено</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Дата оплаты</Label><Input className="mt-1" type="date" value={form.paymentDate} onChange={e => set('paymentDate', e.target.value)} /></div>
                <div><Label>Комментарий</Label><Input className="mt-1" placeholder="Например: 2 занятия в апреле" value={form.comment} onChange={e => set('comment', e.target.value)} /></div>
                <Button type="submit" className="w-full">Добавить</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-emerald-600 mb-1">Получено</p>
            <p className="text-2xl font-bold text-emerald-700">{formatMoney(total)}</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-amber-600 mb-1">Ожидается</p>
            <p className="text-2xl font-bold text-amber-700">{formatMoney(pending)}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-red-600 mb-1">Просрочено</p>
            <p className="text-2xl font-bold text-red-700">{formatMoney(overdue)}</p>
          </CardContent>
        </Card>
      </div>

      {payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="Нет записей об оплате" />
      ) : (
        <div className="space-y-3">
          {payments.map(p => (
            <Card key={p.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{p.student?.user?.fullName}</p>
                      <PayStatusBadge status={p.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground text-base">{formatMoney(p.amount)}</span>
                      {p.paymentDate && <span>Оплачено {formatDate(p.paymentDate)}</span>}
                      {p.comment && <span>· {p.comment}</span>}
                    </div>
                  </div>
                  {p.status !== 'PAID' && (
                    <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => updateStatus(p.id, 'PAID')}>
                      Отметить оплаченным
                    </Button>
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
