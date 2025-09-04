// apps/web/src/App.tsx (更新完整版本)
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'

// 组件导入
import Auth from './components/Auth'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import ResumeEditor from './components/ResumeEditor'
import JobsPage from './pages/JobsPage'
import CareerChatPage from './pages/CareerChatPage'
import InterviewPage from './pages/InterviewPage'
import SkillsPage from './pages/SkillsPage'
import UserProfilePage from './pages/UserProfilePage'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // 获取初始会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user || null)
      setLoading(false)
    })

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 受保护的路由组件
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (loading) {
      return <LoadingSpinner />
    }

    if (!session) {
      return <Auth onAuthChange={setSession} />
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user} />
        <main className="pt-4">
          {children}
        </main>
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 公开路由 */}
          <Route path="/auth" element={
            session ? <Navigate to="/" replace /> : <Auth onAuthChange={setSession} />
          } />

          {/* 受保护的路由 */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/editor" element={
            <ProtectedRoute>
              <ResumeEditor />
            </ProtectedRoute>
          } />

          <Route path="/jobs" element={
            <ProtectedRoute>
              <JobsPage />
            </ProtectedRoute>
          } />

          <Route path="/career-chat" element={
            <ProtectedRoute>
              <CareerChatPage />
            </ProtectedRoute>
          } />

          <Route path="/interview" element={
            <ProtectedRoute>
              <InterviewPage />
            </ProtectedRoute>
          } />

          <Route path="/skills" element={
            <ProtectedRoute>
              <SkillsPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } />

          {/* 重定向未认证用户到登录页面 */}
          <Route path="*" element={
            session ? <Navigate to="/" replace /> : <Navigate to="/auth" replace />
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
