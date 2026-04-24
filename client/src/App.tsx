import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

import PublicLayout from '@/layouts/PublicLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import ProtectedRoute from '@/components/ProtectedRoute'

// Public pages
import HomePage from '@/pages/public/HomePage'
import AboutPage from '@/pages/public/AboutPage'
import ServicesPage from '@/pages/public/ServicesPage'
import PricingPage from '@/pages/public/PricingPage'
import ReviewsPage from '@/pages/public/ReviewsPage'
import ContactPage from '@/pages/public/ContactPage'
import ApplyPage from '@/pages/public/ApplyPage'
import LoginPage from '@/pages/LoginPage'

// Tutor dashboard pages
import DashboardHome from '@/pages/dashboard/DashboardHome'
import ApplicationsPage from '@/pages/dashboard/ApplicationsPage'
import StudentsPage from '@/pages/dashboard/StudentsPage'
import SchedulePage from '@/pages/dashboard/SchedulePage'
import LessonsPage from '@/pages/dashboard/LessonsPage'
import HomeworkPage from '@/pages/dashboard/HomeworkPage'
import MaterialsPage from '@/pages/dashboard/MaterialsPage'
import PaymentsPage from '@/pages/dashboard/PaymentsPage'
import ProfilePage from '@/pages/dashboard/ProfilePage'

// Student pages
import StudentHome from '@/pages/student/StudentHome'
import StudentSchedule from '@/pages/student/StudentSchedule'
import StudentLessons from '@/pages/student/StudentLessons'
import StudentHomework from '@/pages/student/StudentHomework'
import StudentMaterials from '@/pages/student/StudentMaterials'
import StudentProfile from '@/pages/student/StudentProfile'

export default function App() {
  const { token, fetchMe } = useAuthStore()

  useEffect(() => {
    if (token) fetchMe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/apply" element={<ApplyPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        {/* Tutor dashboard */}
        <Route element={<ProtectedRoute role="TUTOR"><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/applications" element={<ApplicationsPage />} />
          <Route path="/dashboard/students" element={<StudentsPage />} />
          <Route path="/dashboard/schedule" element={<SchedulePage />} />
          <Route path="/dashboard/lessons" element={<LessonsPage />} />
          <Route path="/dashboard/homework" element={<HomeworkPage />} />
          <Route path="/dashboard/materials" element={<MaterialsPage />} />
          <Route path="/dashboard/payments" element={<PaymentsPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
        </Route>

        {/* Student cabinet */}
        <Route element={<ProtectedRoute role="STUDENT"><DashboardLayout /></ProtectedRoute>}>
          <Route path="/student" element={<StudentHome />} />
          <Route path="/student/schedule" element={<StudentSchedule />} />
          <Route path="/student/lessons" element={<StudentLessons />} />
          <Route path="/student/homework" element={<StudentHomework />} />
          <Route path="/student/materials" element={<StudentMaterials />} />
          <Route path="/student/profile" element={<StudentProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
