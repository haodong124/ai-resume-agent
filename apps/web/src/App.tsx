// apps/web/src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import EditorPage from './pages/EditorPage'
import JobRecommendations from './components/JobRecommendations'
import CareerChat from './components/CareerChat'

// 简单的主页组件
const HomePage: React.FC = () => {
  const navigate = (path: string) => {
    window.location.href = path
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            让 <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">AI</span> 帮你制作
            <br />完美简历
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            智能优化内容，精准匹配职位，提升面试机会。
            让每一份简历都成为你职场成功的敲门砖。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/editor')}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">简历编辑器</h3>
              <p className="text-gray-600 text-sm">制作专业简历</p>
            </button>
            
            <button
              onClick={() => navigate('/jobs')}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">职位推荐</h3>
              <p className="text-gray-600 text-sm">AI智能匹配</p>
            </button>
            
            <button
              onClick={() => navigate('/career-chat')}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">职业咨询</h3>
              <p className="text-gray-600 text-sm">AI职业顾问</p>
            </button>
            
            <button
              onClick={() => navigate('/interview')}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">模拟面试</h3>
              <p className="text-gray-600 text-sm">面试练习</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 导入缺少的图标
import { MessageSquare, Award, Briefcase } from 'lucide-react'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/jobs" element={<JobRecommendations />} />
          <Route path="/career-chat" element={<CareerChat />} />
          <Route path="/interview" element={<InterviewPage />} />
        </Routes>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
