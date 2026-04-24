import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { CheckCircle, Clock } from 'lucide-react'

const plans = [
  {
    name: 'Разовое занятие',
    price: '2 500',
    unit: 'за урок',
    duration: '90 минут',
    features: ['Любой предмет', 'Онлайн или очно', 'Разбор конкретной темы', 'Домашнее задание'],
    highlight: false,
  },
  {
    name: 'Абонемент 4 занятия',
    price: '9 000',
    unit: 'в месяц',
    duration: '90 мин × 4',
    features: ['Любой предмет', 'Онлайн или очно', 'Индивидуальная программа', 'ДЗ с проверкой', 'Обратная связь между занятиями'],
    highlight: true,
    badge: 'Популярный',
  },
  {
    name: 'Абонемент 8 занятий',
    price: '16 000',
    unit: 'в месяц',
    duration: '90 мин × 8',
    features: ['Любой предмет', '2 занятия в неделю', 'Углублённая подготовка', 'ДЗ с проверкой', 'Материалы в личном кабинете', 'Приоритетная поддержка'],
    highlight: false,
  },
]

const faq = [
  { q: 'Как проходят онлайн-занятия?', a: 'Через Zoom или Google Meet. Использую интерактивную доску. Занятие записывается — можно пересмотреть.' },
  { q: 'Что если урок нужно перенести?', a: 'Предупредите за 24 часа — перенесём без проблем.' },
  { q: 'Нужны ли специальные материалы?', a: 'Нет. Все материалы я предоставляю в личном кабинете ученика.' },
  { q: 'Есть ли пробное занятие?', a: 'Да, первое занятие вводное — знакомимся, определяем уровень и составляем план.' },
]

export default function PricingPage() {
  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-slate-50 to-indigo-50 py-16">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Стоимость</Badge>
          <h1 className="text-4xl font-bold mb-4">Прозрачные цены</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Без скрытых платежей. Оплата по факту занятий.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((p) => (
              <Card key={p.name} className={`relative ${p.highlight ? 'border-primary shadow-lg shadow-primary/10 scale-[1.02]' : 'shadow-sm'}`}>
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="text-xs px-3">{p.badge}</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-base font-medium text-muted-foreground">{p.name}</CardTitle>
                  <div className="mt-3">
                    <span className="text-4xl font-bold">{p.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">₽ / {p.unit}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{p.duration}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5 mb-6">
                    {p.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={p.highlight ? 'default' : 'outline'} asChild>
                    <Link to="/apply">Выбрать</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-8">Частые вопросы</h2>
          <div className="space-y-4">
            {faq.map(f => (
              <Card key={f.q}>
                <CardContent className="p-5">
                  <p className="font-semibold mb-2">{f.q}</p>
                  <p className="text-sm text-muted-foreground">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
