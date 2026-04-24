import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import api from '@/lib/api'
import { CheckCircle } from 'lucide-react'

export default function ApplyPage() {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', phone: '', email: '', subject: '', level: '', preferredTime: '', message: ''
  })

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/applications', form)
      setSuccess(true)
    } catch {
      setError('Ошибка при отправке. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Заявка отправлена!</h2>
          <p className="text-muted-foreground">Свяжусь с вами в течение дня для подтверждения удобного времени.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-slate-50 to-indigo-50 py-16">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Запись</Badge>
          <h1 className="text-4xl font-bold mb-4">Записаться на занятие</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Заполните форму — свяжусь с вами для уточнения удобного времени</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container max-w-lg">
          <Card className="shadow-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label>Имя *</Label>
                  <Input className="mt-1" placeholder="Ваше имя" value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div>
                  <Label>Телефон *</Label>
                  <Input className="mt-1" type="tel" placeholder="+7 916 000 00 00" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input className="mt-1" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div>
                  <Label>Предмет *</Label>
                  <Select onValueChange={v => set('subject', v)} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Выберите предмет" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Математика">Математика</SelectItem>
                      <SelectItem value="Физика">Физика</SelectItem>
                      <SelectItem value="Английский язык">Английский язык</SelectItem>
                      <SelectItem value="Химия">Химия</SelectItem>
                      <SelectItem value="Биология">Биология</SelectItem>
                      <SelectItem value="Русский язык">Русский язык</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Класс / уровень *</Label>
                  <Input className="mt-1" placeholder="Например: 9 класс, Beginner, Взрослый" value={form.level} onChange={e => set('level', e.target.value)} required />
                </div>
                <div>
                  <Label>Удобное время</Label>
                  <Input className="mt-1" placeholder="Например: Вечер в будни, после 18:00" value={form.preferredTime} onChange={e => set('preferredTime', e.target.value)} />
                </div>
                <div>
                  <Label>Сообщение</Label>
                  <Textarea className="mt-1" rows={3} placeholder="Расскажите о своих целях и пожеланиях..." value={form.message} onChange={e => set('message', e.target.value)} />
                </div>
                {error && <p className="text-sm text-destructive bg-destructive/5 px-3 py-2 rounded-lg">{error}</p>}
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Отправка...' : 'Отправить заявку'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
