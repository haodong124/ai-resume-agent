// apps/web/src/components/SmartSkillRecommender.tsx
import React, { useState, useEffect } from 'react'
import { 
  Sparkles, 
  Plus, 
  Clock, 
  TrendingUp, 
  BookOpen,
  CheckCircle,
  X
} from 'lucide-react'
import { useResumeStore } from '../features/resume/state'
import { skillService } from '../services/skillService'
import toast from 'react-hot-toast'

interface SkillSuggestion {
  name: string
  category: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  marketDemand: number
  learningDifficulty: number
}

export const SmartSkillRecommender: React.FC = () => {
  const { resumeData, addSkill } = useResumeStore()
  const [suggestions, setSuggestions] = useState<SkillSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: '全部推荐' },
    { id: '编程语言', name: '编程语言' },
    { id: '前端框架', name: '前端技术' },
    { id: '后端技术', name: '后端技术' },
    { id: '开发工具', name: '开发工具' },
    { id: '软技能', name: '软技能' },
    { id: '新兴技能', name: '新兴技能' }
  ]

  const fetchSuggestions = async () => {
    setLoading(true)
    try {
      const result = await skillService.getSkillSuggestions(resumeData)
      setSuggestions(result)
    } catch (error) {
      console.error('获取技能推荐失败:', error)
      toast.error('获取推荐失败')
    } finally {
      setLoading(false)
    }
  }

  const addRecommendedSkill = (suggestion: SkillSuggestion) => {
    addSkill({
      name: suggestion.name,
      level: suggestion.learningDifficulty <= 5 ? 'intermediate' : 'beginner',
      category: suggestion.category,
      description: suggestion.reason
    })
    
    // 从推荐列表中移除
    setSuggestions(prev => prev.filter(s => s.name !== suggestion.name))
    toast.success(`已添加技能：${suggestion.name}`)
  }

  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '高优先级'
      case 'medium': return '中优先级'
      default: return '低优先级'
    }
  }

  useEffect(() => {
    if (resumeData.personalInfo.name) {
      fetchSuggestions()
    }
  }, [resumeData.personalInfo.title, resumeData.experience.length])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI技能推荐
          </h3>
          <p className="text-gray-600 text-sm mt-1">基于您的背景和目标职位推荐相关技能</p>
        </div>
        
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? '分析中...' : '重新推荐'}
        </button>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 rounded-full text-sm transition ${
              selectedCategory === category.id
                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 推荐列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">AI正在分析您的简历并生成技能推荐...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSuggestions.map((suggestion, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{suggestion.name}</h4>
                  <span className="text-sm text-gray-500">{suggestion.category}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                    {getPriorityLabel(suggestion.priority)}
                  </span>
                  
                  <button
                    onClick={() => addRecommendedSkill(suggestion)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                    title="添加到简历"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">{suggestion.reason}</p>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>市场需求: {suggestion.marketDemand}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>难度: {suggestion.learningDifficulty}/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredSuggestions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无推荐技能</p>
          <p className="text-sm">请完善简历信息或更换筛选条件</p>
        </div>
      )}
    </div>
  )
}

export default SmartSkillRecommender
