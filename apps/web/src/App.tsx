import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { EditorPage } from './pages/EditorPage'

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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/editor')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all text-lg font-semibold"
            >
              开始制作简历
            </button>
            
            <button
              onClick={() => navigate('/jobs-match')}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-purple-600 hover:text-purple-600 transition-all text-lg font-semibold"
            >
              职位匹配分析
            </button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI 智能优化</h3>
            <p className="text-gray-600">自动优化简历内容，提升ATS通过率</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">职位匹配</h3>
            <p className="text-gray-600">精准分析简历与目标职位的匹配度</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">📄</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">专业模板</h3>
            <p className="text-gray-600">多种专业模板，适配不同行业需求</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 简单的职位匹配页面
const JobsMatchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">职位匹配分析</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">功能开发中，敬请期待！</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  )
}

// 技能推荐页面
const SkillsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">技能推荐</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">AI技能推荐功能开发中，敬请期待！</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            返回首页
          </button>
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
          <Route path="/jobs-match" element={<JobsMatchPage />} />
          <Route path="/skills" element={<SkillsPage />} />
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
