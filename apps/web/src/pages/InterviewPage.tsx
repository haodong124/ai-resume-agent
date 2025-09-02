// apps/web/src/pages/InterviewPage.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import InterviewSimulator from '../components/InterviewSimulator'

const InterviewPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">AI模拟面试</h1>
          </div>
        </div>
      </header>

      {/* 面试组件 */}
      <main className="py-8">
        <InterviewSimulator />
      </main>
    </div>
  )
}

export default InterviewPage
