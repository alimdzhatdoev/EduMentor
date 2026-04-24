import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import {
  GraduationCap, LayoutDashboard, Users, Calendar, BookOpen,
  FileText, Package, CreditCard, Settings, LogOut, Bell, ChevronRight, ClipboardList
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const tutorNav = [
  { to: '/dashboard', label: 'Дэшборд', icon: LayoutDashboard, exact: true },
  { to: '/dashboard/applications', label: 'Заявки', icon: ClipboardList },
  { to: '/dashboard/students', label: 'Ученики', icon: Users },
  { to: '/dashboard/schedule', label: 'Расписание', icon: Calendar },
  { to: '/dashboard/lessons', label: 'Занятия', icon: BookOpen },
  { to: '/dashboard/homework', label: 'Домашние задания', icon: FileText },
  { to: '/dashboard/materials', label: 'Материалы', icon: Package },
  { to: '/dashboard/payments', label: 'Оплаты', icon: CreditCard },
]

const studentNav = [
  { to: '/student', label: 'Мой кабинет', icon: LayoutDashboard, exact: true },
  { to: '/student/schedule', label: 'Расписание', icon: Calendar },
  { to: '/student/lessons', label: 'Мои занятия', icon: BookOpen },
  { to: '/student/homework', label: 'Домашние задания', icon: FileText },
  { to: '/student/materials', label: 'Материалы', icon: Package },
]

export default function DashboardLayout() {
  const { user, logout } = useAuthStore()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const nav = user?.role === 'TUTOR' ? tutorNav : studentNav

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (to: string, exact?: boolean) => exact ? pathname === to : pathname.startsWith(to)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b shrink-0">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary">
          <GraduationCap className="h-6 w-6" />
          <span>EduMentor</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              isActive(item.to, item.exact)
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
            {isActive(item.to, item.exact) && <ChevronRight className="ml-auto h-3 w-3" />}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{user?.fullName?.[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Выйти
        </Button>
      </div>
    </div>
  )

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 border-r bg-white shrink-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-white border-r flex flex-col"><SidebarContent /></div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-white px-6 flex items-center justify-between shrink-0">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <button className="h-8 w-8 rounded-lg border flex items-center justify-center hover:bg-slate-50">
              <Bell className="h-4 w-4 text-muted-foreground" />
            </button>
            <Link to={user?.role === 'TUTOR' ? '/dashboard/profile' : '/student/profile'}>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer">
                <span className="text-xs font-bold text-primary">{user?.fullName?.[0]}</span>
              </div>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
