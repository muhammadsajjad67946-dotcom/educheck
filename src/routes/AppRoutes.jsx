import { Route, Routes, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import MainLayout from '../layouts/MainLayout'
import UserLayout from '../layouts/UserLayout'
import AdminLayout from '../layouts/AdminLayout'
import Home from '../pages/Home'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Subscription from '../pages/Subscription'
import Payment from '../pages/Payment'
import PaymentSuccess from '../pages/PaymentSuccess'
import PaymentFailed from '../pages/PaymentFailed'
import StartTest from '../pages/StartTest'
import SubmitTest from '../pages/SubmitTest'
import Loading from '../pages/Loading'
import SummaryReport from '../pages/SummaryReport'
import StandardReport from '../pages/StandardReport'
import StudentPerformancePage from '../pages/StudentPerformancePage'
import RetakeTest from '../pages/RetakeTest'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'
import Feedback from '../pages/Feedback'
import Logout from '../pages/Logout'
import UserPayments from '../pages/UserPayments'
import UserAssessments from '../pages/UserAssessments'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Services from '../pages/Services'
import Features from '../pages/Features'
import NotFound from '../pages/NotFound'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminStudents from '../pages/admin/AdminStudents'
import AdminSubjects from '../pages/admin/AdminSubjects'
import AdminTopics from '../pages/admin/AdminTopics'
import AdminQuestions from '../pages/admin/AdminQuestions'
import AdminAssessments from '../pages/admin/AdminAssessments'
import AdminReports from '../pages/admin/AdminReports'
import AdminAnalytics from '../pages/admin/AdminAnalytics'
import AdminPayments from '../pages/admin/AdminPayments'
import AdminFeedback from '../pages/admin/AdminFeedback'
import AdminContacts from '../pages/admin/AdminContacts'
import AdminSettings from '../pages/admin/AdminSettings'

// Wrapper component to protect user routes
function UserRouteGuard() {
  const { authenticated, user } = useApp()
  const location = useLocation()

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <Outlet />
}

// Wrapper component to protect admin routes
function AdminRouteGuard() {
  const { authenticated, user } = useApp()

  if (!authenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return <AdminLayout />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/features" element={<Features />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<UserRouteGuard />}>
        <Route element={<MainLayout />}>
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
            <Route path="/start-test" element={<StartTest />} />
            <Route path="/submit-test" element={<SubmitTest />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/summary-report" element={<SummaryReport />} />
            <Route path="/standard-report" element={<StandardReport />} />
            <Route path="/student-performance/:assessmentId" element={<StudentPerformancePage />} />
            <Route path="/retake-test" element={<RetakeTest />} />
            <Route path="/user/assessments" element={<UserAssessments />} />
            <Route path="/user/payments" element={<UserPayments />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
        </Route>
      </Route>

      {/* Admin Routes - Protected */}
      <Route element={<AdminRouteGuard />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/subjects" element={<AdminSubjects />} />
        <Route path="/admin/topics" element={<AdminTopics />} />
        <Route path="/admin/questions" element={<AdminQuestions />} />
        <Route path="/admin/assessments" element={<AdminAssessments />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
        <Route path="/admin/contacts" element={<AdminContacts />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
