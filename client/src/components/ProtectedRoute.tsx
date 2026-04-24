import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Role } from '@/types'

interface Props {
  children: React.ReactNode
  role?: Role
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user, token } = useAuthStore()
  if (!token || !user) return <Navigate to="/login" replace />
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'TUTOR' ? '/dashboard' : '/student'} replace />
  }
  return <>{children}</>
}
