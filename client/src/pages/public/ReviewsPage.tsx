import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'

const reviews = [
  { name: 'Мария К.', role: 'Мама Алины, 9 класс', subject: 'Математика', text: 'Анна — потрясающий педагог. Дочь подтянула математику с 50 до 88 баллов за 4 месяца. Очень рекомендую!', rating: 5, year: '2024' },
  { name: 'Даниил П.', role: 'Студент МГУ', subject: 'Физика', text: 'Готовился к ЕГЭ по физике. Анна объясняет сложные вещи очень понятно. Набрал 89 баллов, поступил куда хотел.', rating: 5, year: '2024' },
  { name: 'Светлана Н.', role: 'Ученица, 11 класс', subject: 'Английский', text: 'Занимаюсь английским второй год. Сдала IELTS на 7.0! Без этих занятий не представляю как бы справилась.', rating: 5, year: '2023' },
  { name: 'Артём Ж.', role: 'Студент', subject: 'Математика', text: 'Занимался 8 месяцев, поднял балл с 60 до 95 по ЕГЭ. Очень структурированный подход, всё по делу.', rating: 5, year: '2023' },
  { name: 'Инна Т.', role: 'Мама Максима', subject: 'Химия', text: 'Сын занимался химией перед ЕГЭ. Репетитор очень профессиональная, объясняет доступно. Рекомендую.', rating: 5, year: '2024' },
  { name: 'Женя С.', role: 'Ученица, 10 класс', subject: 'Математика', text: 'Наконец-то начала понимать геометрию! Анна объясняет терпеливо и с примерами из реальной жизни.', rating: 5, year: '2024' },
]

export default function ReviewsPage() {
  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-slate-50 to-indigo-50 py-16">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Отзывы</Badge>
          <h1 className="text-4xl font-bold mb-4">Что говорят ученики</h1>
          <p className="text-muted-foreground">Реальные результаты реальных учеников</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
            </div>
            <span className="font-semibold">4.9</span>
            <span className="text-muted-foreground text-sm">· {reviews.length} отзывов</span>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <Card key={r.name} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                    </div>
                    <Badge variant="secondary" className="text-xs">{r.subject}</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground mb-5">"{r.text}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{r.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.role}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{r.year}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
