import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

const services = [
  {
    title: 'Математика',
    emoji: '📐',
    levels: ['5–9 класс (ОГЭ)', '10–11 класс (ЕГЭ)', 'Олимпиады', 'Углублённый курс'],
    desc: 'Алгебра, геометрия, тригонометрия, математический анализ. Работаем с пробелами в знаниях и планомерно готовимся к экзаменам.',
    includes: ['Разбор теории с примерами', 'Практика на реальных задачах ЕГЭ/ОГЭ', 'Анализ ошибок', 'Домашние задания с проверкой'],
  },
  {
    title: 'Физика',
    emoji: '⚡',
    levels: ['7–9 класс (ОГЭ)', '10–11 класс (ЕГЭ)', 'Олимпиады', 'Поступление в вуз'],
    desc: 'Механика, электродинамика, оптика, квантовая физика. Учимся не только решать задачи, но и понимать физические явления.',
    includes: ['Теория с демонстрациями', 'Задачи повышенной сложности', 'Подготовка к контрольным', 'Разбор вариантов ЕГЭ/ОГЭ'],
  },
  {
    title: 'Английский язык',
    emoji: '🌍',
    levels: ['Начинающие (A1–A2)', 'Intermediate (B1–B2)', 'Upper-Intermediate (C1)', 'IELTS / TOEFL'],
    desc: 'Грамматика, лексика, разговорная практика, подготовка к международным экзаменам. Занятия полностью на английском.',
    includes: ['Грамматика и лексика', 'Разговорная практика', 'Writing и Reading skills', 'IELTS / TOEFL стратегии'],
  },
  {
    title: 'Химия',
    emoji: '🧪',
    levels: ['8–9 класс (ОГЭ)', '10–11 класс (ЕГЭ)', 'Олимпиадная химия', 'Поступление в медвуз'],
    desc: 'Органическая и неорганическая химия. Разбираем реакции, формулы, решаем задачи. Подготовка к ЕГЭ и олимпиадам.',
    includes: ['Систематическое изучение тем', 'Задачи разного уровня', 'Олимпиадная подготовка', 'Разбор вариантов ЕГЭ'],
  },
]

export default function ServicesPage() {
  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-slate-50 to-indigo-50 py-20">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Направления</Badge>
          <h1 className="text-4xl font-bold mb-4">Услуги и предметы</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Подготовка к ОГЭ, ЕГЭ и международным экзаменам. Индивидуальный подход к каждому ученику.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((s) => (
              <Card key={s.title} className="shadow-sm hover:shadow-lg transition-shadow border-0 ring-1 ring-slate-100">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl">
                      {s.emoji}
                    </div>
                    <CardTitle className="text-xl">{s.title}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {s.levels.map(l => (
                      <Badge key={l} variant="secondary" className="text-xs font-normal">{l}</Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{s.desc}</p>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Включает</p>
                    <ul className="space-y-2">
                      {s.includes.map(i => (
                        <li key={i} className="flex items-center gap-2.5 text-sm">
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-14">
            <p className="text-muted-foreground mb-4">Не нашли нужный предмет? Уточните при записи — помогу или порекомендую коллегу.</p>
            <Button size="lg" asChild><Link to="/apply">Записаться на занятие</Link></Button>
          </div>
        </div>
      </section>
    </div>
  )
}
