// apps/web/src/App.tsx
import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import './App.css'

// 懒加载页面组件
const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const EditorPage = lazy(() => import('./pages/EditorPage'))
const WorkspacePage = lazy(() => import('./pages/WorkspacePage'))
const JobRecommendationsPage = lazy(() => import('./pages/JobRecommendationsPage'))
const SharePage = lazy(() => import('./pages/SharePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// 加载组件
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
      <p className="mt-4 text-gray-600">加载中...</p>
    </div>
  </div>
)

function App() {
  return (
    <>
      {/* Toast 通知容器 */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* 首页 */}
            <Route path="/" element={<LandingPage />} />
            
            {/* 认证相关 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* 主要功能页面 */}
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/jobs" element={<JobRecommendationsPage />} />
            
            {/* 分享页面 */}
            <Route path="/share/:id" element={<SharePage />} />
            
            {/* 默认重定向 */}
            <Route path="/dashboard" element={<Navigate to="/workspace" replace />} />
            
            {/* 404 页面 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  )
}

export default App
