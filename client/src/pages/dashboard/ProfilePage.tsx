import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/authStore'
import { Mail, Phone, Calendar, GraduationCap, Shield } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ProfilePage() {
  const { user } = useAuthStore()
  if (!user) return null

  const isTutor = user.role === 'TUTOR'

  const fields = [
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Phone, label: 'Телефон', value: user.phone || 'Не указан' },
    { icon: Calendar, label: 'В системе с', value: user.createdAt ? formatDate(user.createdAt) : '—' },
    { icon: Shield, label: 'Роль', value: isTutor ? 'Репетитор' : 'Ученик' },
  ]

  return (
    <div className="animate-fade-in max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Профиль</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Ваши данные в системе</p>
      </div>

      <Card className="overflow-hidden">
        {/* Banner */}
        <div className={`h-28 ${isTutor ? 'bg-gradient-to-r from-indigo-600 to-violet-700' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`} />
        <CardContent className="px-8 pb-8">
          <div className="flex items-end gap-5 -mt-10 mb-7">
            <div className="h-20 w-20 rounded-2xl bg-white shadow-lg ring-4 ring-white flex items-center justify-center shrink-0">
              <span className="text-3xl font-bold text-primary">{user.fullName[0]}</span>
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-bold text-slate-900">{user.fullName}</h2>
              <Badge
                className={`mt-1 text-xs ${isTutor ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'}`}
              >
                {isTutor ? (
                  <><GraduationCap className="h-3 w-3 mr-1" />Репетитор</>
                ) : 'Ученик'}
              </Badge>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {fields.map(item => (
              <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="h-9 w-9 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
