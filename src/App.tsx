import { useState, useEffect } from 'react'
import AuthPage from './pages/AuthPage'
import AdminDashboard from './pages/AdminDashboard'
import ClientDashboard from './pages/ClientDashboard'
import { UserRole } from './types'

export default function App() {
  const [role, setRole] = useState<UserRole>(null)
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  if (role === 'admin') {
    return <AdminDashboard onLogout={() => setRole(null)} dark={dark} onToggleDark={() => setDark((d) => !d)} />
  }
  if (role === 'client') {
    return <ClientDashboard onLogout={() => setRole(null)} dark={dark} onToggleDark={() => setDark((d) => !d)} />
  }
  return <AuthPage onEnter={setRole} dark={dark} onToggleDark={() => setDark((d) => !d)} />
}
