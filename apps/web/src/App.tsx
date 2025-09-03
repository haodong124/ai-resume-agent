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
import JobsPage from './pages/JobsPage'
import InterviewPage from './pages/InterviewPage'
import SkillsPage from './pages/SkillsPage'

// 主页组件
const HomeMainPage: React.FC = () => {
  const navigate = (path: string) => {
    window.location.href = path
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
            让 <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">AI</span> 助力
            <br />你的职场之路
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            从简历制作到职业规划，从技能提升到面试准备
            <br />
            一站式AI职业发展平台，让每一步都更精准
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/editor')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all text-lg font-semibold"
            >
              开始制作简历
            </button>
            
            <button
              onClick={() => navigate('/career-chat')}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-purple-600 hover:text-purple-600 transition-all text-lg font-semibold"
            >
              AI职业咨询
            </button>
          </div>
        </div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-20">
          {[
            {
              path: '/editor',
              icon: 'User',
              title: '简历编辑器',
              description: '智能简历制作工具',
              color: 'purple',
              features: ['AI内容优化', '多种模板', '实时预览', 'PDF导出']
            },
            {
              path: '/jobs',
              icon: 'Briefcase',
              title: '职位推荐',
              description: 'AI智能职位匹配',
              color: 'blue',
              features: ['智能匹配', '匹配分析', '技能差距', '申请建议']
            },
            {
              path: '/career-chat',
              icon: 'MessageSquare',
              title: '职业咨询',
              description: 'AI职业顾问服务',
              color: 'green',
              features: ['职业规划', '面试准备', '求职指导', '24/7在线']
            },
            {
              path: '/interview',
              icon: 'Award',
              title: '模拟面试',
              description: 'AI面试练习平台',
              color: 'orange',
              features: ['真实场景', '即时反馈', '多种题型', '能力评估']
            },
            {
              path: '/skills',
              icon: 'BookOpen',
              title: '技能发展',
              description: '个性化学习路径',
              color: 'indigo',
              features: ['技能推荐', '学习规划', '进度跟踪', '资源推荐']
            }
          ].map((feature) => (
            <div
              key={feature.path}
              onClick={() => navigate(feature.path)}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-6 h-full">
                <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:bg-${feature.color}-200 transition-colors`}>
                  <div className={`w-7 h-7 text-${feature.color}-600`}>
                    {feature.icon === 'User' && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {feature.icon === 'Briefcase' && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    {feature.icon === 'MessageSquare' && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    )}
                    {feature.icon === 'Award' && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    )}
                    {feature.icon === 'BookOpen' && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-sm text-center mb-4">{feature.description}</p>
                
                <div className="space-y-2">
                  {feature.features.map((feat, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-500">
                      <div className={`w-1.5 h-1.5 bg-${feature.color}-400 rounded-full mr-2`}></div>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 特色介绍 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">AI智能优化</h3>
            <p className="text-gray-600 leading-relaxed">
              基于大语言模型的内容优化，自动分析简历质量，提供个性化改进建议，让每份简历都脱颖而出
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">精准匹配</h3>
            <p className="text-gray-600 leading-relaxed">
              智能分析职位需求与个人背景，计算匹配度评分，识别技能差距，提供针对性的优化方案
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl">📈</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">全程指导</h3>
            <p className="text-gray-600 leading-relaxed">
              从技能规划到面试准备，提供全方位职业发展指导，制定个性化学习路径，助力职业成长
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 公开页面 */}
          <Route path="/" element={<HomeMainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          
          {/* 应用页面 */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="/career-chat" element={<CareerChatPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/skills" element={<SkillsPage />} />
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
