import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Star, BookOpen, Clock, Users, Award, CheckCircle, ArrowRight,
  Laptop, MapPin, MessageCircle, TrendingUp, Shield, Zap
} from 'lucide-react'

const subjects = ['Математика', 'Физика', 'Английский язык', 'Химия', 'Биология', 'Русский язык']

const advantages = [
  { icon: Award, title: 'Опыт 8+ лет', desc: 'Подготовила более 200 учеников к ОГЭ, ЕГЭ и международным экзаменам' },
  { icon: TrendingUp, title: 'Высокий результат', desc: '92% учеников поступают в выбранные университеты после подготовки' },
  { icon: Shield, title: 'Индивидуальный подход', desc: 'Программа составляется с учётом целей, уровня и темпа каждого ученика' },
  { icon: Zap, title: 'Современные методы', desc: 'Интерактивные материалы, разбор реальных задач, работа с ошибками' },
]

const formats = [
  { icon: Laptop, title: 'Онлайн-занятия', desc: 'Занятия через видеосвязь с интерактивной доской. Удобно из любой точки.' },
  { icon: MapPin, title: 'Очные занятия', desc: 'Личные встречи в Москве. Продуктивная атмосфера без отвлекающих факторов.' },
  { icon: MessageCircle, title: 'Поддержка 24/7', desc: 'Отвечаю на вопросы между занятиями, помогаю с домашними заданиями.' },
]

const reviews = [
  { name: 'Мария К.', role: 'Мама Алины, 9 класс', text: 'Анна — потрясающий педагог. Дочь подтянула математику с 50 до 88 баллов за 4 месяца. Очень рекомендую!', rating: 5 },
  { name: 'Даниил П.', role: 'Студент', text: 'Готовился к ЕГЭ по физике. Анна объясняет сложные вещи очень понятно. Набрал 89 баллов, поступил куда хотел.', rating: 5 },
  { name: 'Светлана Н.', role: 'Ученица, 11 класс', text: 'Занимаюсь английским второй год. Сдала IELTS на 7.0! Без этих занятий не представляю как бы справилась.', rating: 5 },
]

const stats = [
  { value: '200+', label: 'Учеников' },
  { value: '8 лет', label: 'Опыта' },
  { value: '92%', label: 'Поступают' },
  { value: '4.9', label: 'Рейтинг' },
]

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwVjI4aDZ2NmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="container relative py-24 md:py-32">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/20">
              ✨ Репетитор с 8-летним опытом
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Достигай высоких{' '}
              <span className="text-indigo-200">результатов</span>{' '}
              с профессиональным репетитором
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl leading-relaxed">
              Индивидуальная подготовка к ОГЭ, ЕГЭ, IELTS и углублённое изучение предметов.
              Онлайн и очно. Результат с первых занятий.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg" asChild>
                <Link to="/apply">Записаться на занятие <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent" asChild>
                <Link to="/about">Узнать больше</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              {subjects.map(s => (
                <span key={s} className="text-xs font-medium bg-white/15 border border-white/20 rounded-full px-3 py-1">{s}</span>
              ))}
            </div>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute right-20 bottom-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl translate-y-1/2" />
      </section>

      {/* Stats */}
      <section className="border-b bg-white">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">Почему выбирают меня</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Преимущества работы со мной</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Каждое занятие — шаг к вашей цели. Никаких шаблонов, только результат.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((a) => (
              <Card key={a.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <a.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{a.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">Форматы работы</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Как проходят занятия</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {formats.map((f) => (
              <div key={f.title} className="text-center p-8 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-colors group">
                <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                  <f.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-lg mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">Отзывы</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Что говорят ученики</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <Card key={r.name} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground mb-5">"{r.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{r.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-indigo-100 mb-8 max-w-lg mx-auto">Оставьте заявку — первое занятие можно провести уже на этой неделе</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50" asChild>
              <Link to="/apply">Записаться бесплатно</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent" asChild>
              <Link to="/contact">Задать вопрос</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
