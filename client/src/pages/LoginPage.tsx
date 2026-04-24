import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, Eye, EyeOff, BookOpen, Users, Calendar, CreditCard } from 'lucide-react'

const features = [
  { icon: Users, text: 'Управление учениками' },
  { icon: Calendar, text: 'Расписание занятий' },
  { icon: BookOpen, text: 'Домашние задания' },
  { icon: CreditCard, text: 'Учёт оплат' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      const u = useAuthStore.getState().user
      if (u?.role === 'TUTOR') navigate('/dashboard')
      else navigate('/student')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Неверный email или пароль')
    }
  }

  const fillDemo = (role: 'tutor' | 'student') => {
    if (role === 'tutor') { setEmail('tutor@tutor.ru'); setPassword('tutor123') }
    else { setEmail('alina@student.ru'); setPassword('student123') }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

        <div className="relative">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">EduMentor</span>
          </Link>
        </div>

        <div className="relative space-y-8">
          <div>
            <h2 className="text-3xl font-bold leading-tight mb-4">
              Система управления<br />для репетитора
            </h2>
            <p className="text-indigo-200 leading-relaxed">
              Всё необходимое для эффективной работы: ученики, расписание,
              задания и финансы — в одном месте.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {features.map(f => (
              <div key={f.text} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                <f.icon className="h-4 w-4 text-indigo-200 shrink-0" />
                <span className="text-sm text-indigo-100">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-sm text-indigo-300">
            © 2026 EduMentor · Дипломная работа
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-primary">
              <GraduationCap className="h-8 w-8" />
              EduMentor
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/80 p-8 border border-slate-100">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-slate-900">Вход в систему</h1>
              <p className="text-sm text-muted-foreground mt-1.5">Введите ваши учётные данные</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="mt-1.5 h-11"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium">Пароль</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10 h-11"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/5 border border-destructive/10 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Вход...
                  </span>
                ) : 'Войти'}
              </Button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground text-center mb-3 font-medium">Демо-аккаунты для проверки</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => fillDemo('tutor')}
                  className="text-xs px-3 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors font-medium"
                >
                  Репетитор
                </button>
                <button
                  onClick={() => fillDemo('student')}
                  className="text-xs px-3 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors font-medium"
                >
                  Ученик
                </button>
              </div>
            </div>
          </div>

          <p className="text-center mt-5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">← Вернуться на сайт</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
