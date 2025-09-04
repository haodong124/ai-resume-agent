// apps/web/src/pages/SkillsPage.tsx
import React from 'react'
import SkillAnalysis from '../components/SkillAnalysis'
import { BookOpen, Target, TrendingUp, Users } from 'lucide-react'

const SkillsPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 页面头部 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">技能分析与发展</h1>
        <p className="text-lg text-gray-600 mb-6">
          基于AI分析您的技能现状，制定个性化的学习路径和职业发展规划
        </p>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">当前技能</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">技能缺口</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Target className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">学习路径</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">行业排名</p>
                <p className="text-2xl font-bold">Top 20%</p>
              </div>
              <Users className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>
      </div>

      {/* 技能分析组件 */}
      <SkillAnalysis />
    </div>
  )
}

export default SkillsPage
