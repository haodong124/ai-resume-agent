// apps/web/src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import EditorPage from './pages/EditorPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PricingPage from './pages/PricingPage'
import SharePage from './pages/SharePage'
import CareerChatPage from './pages/CareerChatPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 公开页面 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          
          {/* 应用页面 */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="/career-chat" element={<CareerChatPage />} />
          <Route path="/share/:id" element={<SharePage />} />
          
          {/* 404 页面 */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        
        {/* Toast 通知 */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
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
      </div>
    </Router>
  )
}

export default App
