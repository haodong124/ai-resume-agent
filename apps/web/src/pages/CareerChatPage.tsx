// apps/web/src/pages/CareerChatPage.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import CareerChat from '../components/CareerChat'

const CareerChatPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="h-screen flex flex-col bg-gray-50">
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
            <h1 className="text-xl font-semibold">AI职业顾问</h1>
          </div>
        </div>
      </header>

      {/* 聊天组件 */}
      <main className="flex-1">
        <CareerChat />
      </main>
    </div>
  )
}

export default CareerChatPage
