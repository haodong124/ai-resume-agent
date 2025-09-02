// apps/web/src/pages/SkillsPage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, BookOpen, Target } from 'lucide-react'
import SmartSkillRecommender from '../components/SmartSkillRecommender'
import LearningPathPlanner from '../components/LearningPathPlanner'

const SkillsPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'recommend' | 'learning'>('recommend')

  const tabs = [
    { id: 'recommend', name: '技能推荐', icon: Sparkles },
    { id: 'learning', name: '学习路径', icon: BookOpen }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition mr-4"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold">技能发展中心</h1>
            </div>
            
            {/* 标签导航 */}
            <div className="flex border border-gray-200 rounded-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-4 py-2 text-sm font-medium transition ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    } ${tab.id === 'recommend' ? 'rounded-l-lg' : 'rounded-r-lg'}`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          {activeTab === 'recommend' && <SmartSkillRecommender />}
          {activeTab === 'learning' && <LearningPathPlanner />}
        </div>
      </main>
    </div>
  )
}

export default SkillsPage
