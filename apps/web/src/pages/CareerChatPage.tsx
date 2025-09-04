// apps/web/src/pages/CareerChatPage.tsx
import React from 'react'
import CareerChat from '../components/CareerChat'

const CareerChatPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI职业顾问</h1>
        <p className="text-gray-600">
          与AI职业顾问对话，获取个性化的职业规划建议、面试指导和技能提升方案
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg">
        <CareerChat />
      </div>
    </div>
  )
}

export default CareerChatPage
