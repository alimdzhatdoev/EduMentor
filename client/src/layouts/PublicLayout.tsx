import { Link, Outlet, useLocation } from 'react-router-dom'
import { GraduationCap, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/about', label: 'О репетиторе' },
  { to: '/services', label: 'Услуги' },
  { to: '/pricing', label: 'Стоимость' },
  { to: '/reviews', label: 'Отзывы' },
  { to: '/contact', label: 'Контакты' },
]

export default function PublicLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <GraduationCap className="h-6 w-6" />
            EduMentor
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className={cn('text-sm font-medium transition-colors hover:text-primary', pathname === l.to ? 'text-primary' : 'text-muted-foreground')}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild><Link to="/login">Войти</Link></Button>
            <Button size="sm" asChild><Link to="/apply">Записаться</Link></Button>
          </div>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t bg-white px-4 pb-4">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-foreground">{l.label}</Link>
            ))}
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="flex-1" asChild><Link to="/login">Войти</Link></Button>
              <Button size="sm" className="flex-1" asChild><Link to="/apply">Записаться</Link></Button>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t bg-slate-50 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 font-bold text-primary mb-3">
                <GraduationCap className="h-5 w-5" /> EduMentor
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">Профессиональная подготовка к экзаменам и углублённое изучение предметов</p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <p className="font-medium mb-3">Навигация</p>
                {navLinks.slice(0, 3).map(l => <Link key={l.to} to={l.to} className="block text-muted-foreground hover:text-foreground mb-2">{l.label}</Link>)}
              </div>
              <div>
                <p className="font-medium mb-3">Контакты</p>
                <p className="text-muted-foreground">+7 916 123 45 67</p>
                <p className="text-muted-foreground mt-1">tutor@tutor.ru</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2026 EduMentor. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  )
}
