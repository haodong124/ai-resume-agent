import React, { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Clock, DollarSign, Plus, X } from 'lucide-react'
import { useResumeStore } from '../features/resume/state'
import { ResumeAPI } from '../features/resume/api'
import toast from 'react-hot-toast'

interface SkillRecommendation {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  marketDemand: string
  salaryImpact: string
  learningTime: string
  learningPath: string[]
  resources: string[]
  relatedSkills: string[]
  applicationScenarios: string[]
}

interface SkillGapAnalysis {
  currentStrengths: string[]
  criticalGaps: string[]
  opportunities: string[]
}

interface CareerPathSuggestion {
  role: string
  requiredSkills: string[]
  timeframe: string
  salaryRange: string
}

export const SkillRecommender: React.FC = () => {
  const { resumeData, updateResumeData } = useResumeStore()
  const [recommendations, setRecommendations] = useState<SkillRecommendation[]>([])
  const [gapAnalysis, setGapAnalysis] = useState<SkillGapAnalysis | null>(null)
  const [careerPaths, setCareerPaths] = useState<CareerPathSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: '全部', color: 'bg-gray-100' },
    { id: '核心专业技能', name: '核心技能', color: 'bg-blue-100' },
    { id: '软件工具技能', name: '工具技能', color: 'bg-green-100' },
    { id: '可迁移技能', name: '软技能', color: 'bg-purple-100' },
    { id: '新兴技能', name: '新兴技能', color: 'bg-orange-100' },
  ]

  const fetchRecommendations = async () => {
    if (!resumeData.education.length && !resumeData.experience.length) {
      toast.info('请先完善教育背景或工作经历')
      return
    }

    setIsLoading(true)
    try {
      const response = await ResumeAPI.getSuggestions(resumeData)
      
      if (response.recommendedSkills) {
        setRecommendations(response.recommendedSkills)
      }
      if (response.skillGapAnalysis) {
        setGapAnalysis(response.skillGapAnalysis)
      }
      if (response.careerPathSuggestions) {
        setCareerPaths(response.careerPathSuggestions)
      }
      
      toast.success('技能推荐生成成功！')
    } catch (error) {
      toast.error('获取推荐失败，请重试')
      console.error('Skill recommendation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (resumeData.education.length > 0 || resumeData.experience.length > 0) {
      fetchRecommendations()
    }
  }, [resumeData.education, resumeData.experience])

  const addSkillToResume = (skill: SkillRecommendation) => {
    const existingSkill = resumeData.skills.find(s => 
      s.name.toLowerCase() === skill.name.toLowerCase()
    )
    
    if (existingSkill) {
      toast.info('该技能已存在')
      return
    }

    const newSkill = {
      id: Date.now().toString(),
      name: skill.name,
      level: skill.level,
      category: skill.category === '核心专业技能' ? 'technical' as const : 
               skill.category === '软件工具技能' ? 'tool' as const :
               skill.category === '可迁移技能' ? 'soft' as const : 'technical' as const,
    }

    updateResumeData({
      skills: [...resumeData.skills, newSkill]
    })
    
    toast.success(`已添加技能: ${skill.name}`)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedCategory)

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-800">AI 技能推荐</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          基于您的教育背景和工作经历，AI为您推荐最有价值的技能，助力职业发展
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <button
          onClick={fetchRecommendations}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5" />
          {isLoading ? '分析中...' : '重新分析推荐'}
        </button>
      </div>

      {/* Gap Analysis */}
      {gapAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">当前优势</h3>
            <ul className="space-y-2">
              {gapAnalysis.currentStrengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm text-green-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">关键差距</h3>
            <ul className="space-y-2">
              {gapAnalysis.criticalGaps.map((gap, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">!</span>
                  <span className="text-sm text-red-700">{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">发展机会</h3>
            <ul className="space-y-2">
              {gapAnalysis.opportunities.map((opportunity, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">→</span>
                  <span className="text-sm text-blue-700">{opportunity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Category Filter */}
      {recommendations.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Skill Recommendations */}
      {filteredRecommendations.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRecommendations.map((skill, index) => (
            <div key={index} className="bg-white rounded-lg border shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{skill.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded border ${getPriorityColor(skill.priority)}`}>
                        {skill.priority === 'high' ? '高优先级' : 
                         skill.priority === 'medium' ? '中优先级' : '低优先级'}
                      </span>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        {skill.level === 'beginner' ? '初级' : 
                         skill.level === 'intermediate' ? '中级' : '高级'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => addSkillToResume(skill)}
                    className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    添加
                  </button>
                </div>

                {/* Reason */}
                <p className="text-gray-700 mb-4 leading-relaxed">{skill.reason}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">市场需求</p>
                      <p className="text-sm font-medium text-gray-800">{skill.marketDemand}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-yellow-600" />
                    <div>
                      <p className="text-xs text-gray-500">薪资影响</p>
                      <p className="text-sm font-medium text-gray-800">{skill.salaryImpact}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">学习时间</p>
                      <p className="text-sm font-medium text-gray-800">{skill.learningTime}</p>
                    </div>
                  </div>
                </div>

                {/* Learning Path */}
                {skill.learningPath && skill.learningPath.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">学习路径</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      {skill.learningPath.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm text-gray-600">{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Related Skills */}
                {skill.relatedSkills && skill.relatedSkills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">相关技能</h4>
                    <div className="flex flex-wrap gap-2">
                      {skill.relatedSkills.map((relatedSkill, relatedIndex) => (
                        <span 
                          key={relatedIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {relatedSkill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Application Scenarios */}
                {skill.applicationScenarios && skill.applicationScenarios.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">应用场景</h4>
                    <ul className="space-y-1">
                      {skill.applicationScenarios.map((scenario, scenarioIndex) => (
                        <li key={scenarioIndex} className="text-sm text-gray-600 flex items-start gap-1">
                          <span className="text-gray-400">•</span>
                          <span>{scenario}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Career Path Suggestions */}
      {careerPaths.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            推荐职业发展路径
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerPaths.map((path, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-3">{path.role}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">所需技能</p>
                    <div className="flex flex-wrap gap-2">
                      {path.requiredSkills.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-gray-500">预计时间: </span>
                      <span className="font-medium text-gray-800">{path.timeframe}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">薪资范围: </span>
                      <span className="font-medium text-green-600">{path.salaryRange}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && recommendations.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">还没有技能推荐</h3>
          <p className="text-gray-500 mb-6">请先完善您的教育背景或工作经历，以获得个性化的技能推荐</p>
        </div>
      )}
    </div>
  )
}
