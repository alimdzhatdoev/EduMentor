import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { GraduationCap, Award, BookOpen, Users, CheckCircle } from 'lucide-react'

const education = [
  { year: '2012', title: 'МГУ им. М.В. Ломоносова', desc: 'Механико-математический факультет, специальность «Математика»' },
  { year: '2014', title: 'Магистратура МГУ', desc: 'Прикладная математика и информатика' },
  { year: '2016', title: 'Cambridge CELTA', desc: 'Сертификат преподавания английского языка как иностранного' },
]

const experience = [
  'Подготовка к ОГЭ, ЕГЭ, IELTS, TOEFL',
  'Работа с учениками 5–11 классов',
  'Олимпиадная математика и физика',
  'Программирование для школьников',
  'Интенсивы и групповые занятия',
  'Разработка индивидуальных программ',
]

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 to-indigo-50 py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">О репетиторе</Badge>
              <h1 className="text-4xl font-bold mb-6">Анна Соколова</h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Репетитор по математике, физике и английскому языку с 8-летним опытом.
                Специализируюсь на подготовке к ОГЭ, ЕГЭ и IELTS.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Моя цель — не просто объяснить тему, а научить мыслить самостоятельно.
                Каждый ученик получает индивидуальную программу, которая учитывает его уровень,
                темп усвоения и конечную цель.
              </p>
              <Button asChild><Link to="/apply">Записаться к репетитору</Link></Button>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl">
                  <GraduationCap className="h-32 w-32 text-white/80" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                  <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Award className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">8+ лет опыта</p>
                    <p className="text-xs text-muted-foreground">200+ учеников</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Образование и сертификаты</h2>
            <div className="space-y-4">
              {education.map((e) => (
                <Card key={e.year} className="border-l-4 border-l-primary">
                  <CardContent className="p-5 flex gap-4">
                    <div className="shrink-0">
                      <Badge variant="secondary">{e.year}</Badge>
                    </div>
                    <div>
                      <p className="font-semibold">{e.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{e.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Чем я занимаюсь</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {experience.map((e) => (
                <div key={e} className="flex items-center gap-3 p-4 bg-white rounded-xl border">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span className="text-sm font-medium">{e}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
