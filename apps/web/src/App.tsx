// apps/web/src/App.tsx (最终完整版)
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { MessageSquare, Award, Briefcase, User, BookOpen } from 'lucide-react'

// 页面组件
import EditorPage from './pages/EditorPage'
import JobsPage from './pages/JobsPage'
import CareerChatPage from './pages/CareerChatPage'
import InterviewPage from './pages/InterviewPage'
import SkillsPage from './pages/SkillsPage'

// 主页组件
const HomePage: React.FC = () => {
  const navigate = (path: string) => {
    window.location.href = path
  }

  const features = [
    {
      path: '/editor',
      icon: User,
      title: '简历编辑器',
      description: '智能简历制作工具',
      color: 'purple',
      features: ['AI内容优化', '多种模板', '实时预览', 'PDF导出']
    },
    {
      path: '/jobs',
      icon: Briefcase,
      title: '职位推荐',
      description: 'AI智能职位匹配',
      color: 'blue',
      features: ['智能匹配', '匹配分析', '技能差距', '申请建议']
    },
    {
      path: '/career-chat',
      icon: MessageSquare,
      title: '职业咨询',
      description: 'AI职业顾问服务',
      color: 'green',
      features: ['职业规划', '面试准备', '求职指导', '24/7在线']
    },
    {
      path: '/interview',
      icon: Award,
      title: '模拟面试',
      description: 'AI面试练习平台',
      color: 'orange',
      features: ['真实场景', '即时反馈', '多种题型', '能力评估']
    },
    {
      path: '/skills',
      icon: BookOpen,
      title: '技能发展',
      description: '个性化学习路径',
      color: 'indigo',
      features: ['技能推荐', '学习规划', '进度跟踪', '资源推荐']
    }
  ]

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
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.path}
                onClick={() => navigate(feature.path)}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-6 h-full">
                  <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:bg-${feature.color}-200 transition-colors`}>
                    <Icon className={`w-7 h-7 text-${feature.color}-600`} />
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
            )
          })}
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
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/career-chat" element={<CareerChatPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/skills" element={<SkillsPage />} />
        </Routes>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px'
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
