// apps/web/src/pages/InterviewPage.tsx
import React from 'react'
import InterviewSimulator from '../components/InterviewSimulator'
import { Award, Clock, Target, TrendingUp } from 'lucide-react'

const InterviewPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 页面头部 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI模拟面试</h1>
        <p className="text-lg text-gray-600 mb-6">
          通过AI驱动的模拟面试，提升您的面试表现和求职竞争力
        </p>

        {/* 功能特点 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center mb-3">
              <Award className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="font-semibold">真实场景</h3>
            </div>
            <p className="text-sm text-gray-600">
              基于真实公司面试题库，模拟实际面试环境
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center mb-3">
              <Clock className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="font-semibold">即时反馈</h3>
            </div>
            <p className="text-sm text-gray-600">
              AI实时分析您的回答，提供详细的评估和建议
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center mb-3">
              <Target className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="font-semibold">多种题型</h3>
            </div>
            <p className="text-sm text-gray-600">
              涵盖技术问题、行为问题、情境问题等各类题型
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center mb-3">
              <TrendingUp className="w-6 h-6 text-orange-600 mr-2" />
              <h3 className="font-semibold">能力提升</h3>
            </div>
            <p className="text-sm text-gray-600">
              追踪进步轨迹，制定个性化的面试准备计划
            </p>
          </div>
        </div>
      </div>

      {/* 面试模拟器 */}
      <InterviewSimulator />
    </div>
  )
}

export default InterviewPage
