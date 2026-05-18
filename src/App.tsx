import { useState } from 'react'
import AuthPage from './pages/AuthPage'
import AdminDashboard from './pages/AdminDashboard'
import ClientDashboard from './pages/ClientDashboard'
import { UserRole } from './types'

export default function App() {
  const [role, setRole] = useState<UserRole>(null)

  if (role === 'admin') {
    return <AdminDashboard onLogout={() => setRole(null)} />
  }
  if (role === 'client') {
    return <ClientDashboard onLogout={() => setRole(null)} />
  }
  return <AuthPage onEnter={setRole} />
}
