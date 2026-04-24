import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Link } from 'react-router-dom'
import { Phone, Mail, Clock, MapPin } from 'lucide-react'
import { useState } from 'react'

const contacts = [
  { icon: Phone, label: 'Телефон', value: '+7 916 123 45 67', href: 'tel:+79161234567' },
  { icon: Mail, label: 'Email', value: 'tutor@tutor.ru', href: 'mailto:tutor@tutor.ru' },
  { icon: Clock, label: 'Время работы', value: 'Пн–Сб: 9:00–20:00', href: null },
  { icon: MapPin, label: 'Город', value: 'Москва (очно и онлайн)', href: null },
]

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-slate-50 to-indigo-50 py-16">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Контакты</Badge>
          <h1 className="text-4xl font-bold mb-4">Свяжитесь со мной</h1>
          <p className="text-muted-foreground">Отвечу на любые вопросы в течение дня</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h2 className="text-xl font-semibold mb-6">Контактная информация</h2>
              <div className="space-y-4 mb-8">
                {contacts.map((c) => (
                  <div key={c.label} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <c.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{c.label}</p>
                      {c.href ? (
                        <a href={c.href} className="text-sm font-medium hover:text-primary">{c.value}</a>
                      ) : (
                        <p className="text-sm font-medium">{c.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild><Link to="/apply">Записаться на занятие</Link></Button>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-6">Напишите мне</h2>
              {sent ? (
                <div className="text-center py-8 bg-emerald-50 rounded-2xl">
                  <p className="text-2xl mb-2">✅</p>
                  <p className="font-semibold">Сообщение отправлено!</p>
                  <p className="text-sm text-muted-foreground mt-1">Отвечу в течение нескольких часов</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Имя</Label>
                    <Input className="mt-1" placeholder="Ваше имя" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input className="mt-1" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Сообщение</Label>
                    <Textarea className="mt-1" rows={4} placeholder="Ваш вопрос..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
                  </div>
                  <Button type="submit" className="w-full">Отправить</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
