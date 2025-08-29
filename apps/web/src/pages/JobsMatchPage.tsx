import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Briefcase, Target, TrendingUp, AlertCircle } from 'lucide-react'
import { useResumeStore } from '../features/resume/state'
import { ResumeAPI } from '../features/resume/api'
import toast from 'react-hot-toast'

interface MatchResult {
  score: number
  matched: string[]
  missing: string[]
  suggestions: string[]
  gaps: Array<{
    category: string
    description: string
    priority: 'high' | 'medium' | 'low'
  }>
}

export const JobsMatchPage: React.FC = () => {
  const navigate = useNavigate()
  const { resumeData } = useResumeStore()
  const [jobDescription, setJobDescription] = useState('')
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error('请输入职位描述')
      return
    }

    setIsAnalyzing(true)
    try {
      const result = await ResumeAPI.matchJobs(resumeData, jobDescription)
      setMatchResult(result)
      
      if (result.score >= 80) {
        toast.success('匹配度很高！')
      } else if (result.score >= 60) {
        toast.info('匹配度中等，建议优化简历')
      } else {
        toast.warning('匹配度较低，需要重点改进')
      }
    } catch (error) {
      toast.error('分析失败，请重试')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/editor')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold">职位匹配分析</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入区 */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                职位描述
              </h2>
              
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="粘贴职位描述或JD..."
                className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobDescription.trim()}
                className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? '分析中...' : '开始匹配分析'}
              </button>
            </div>
          </div>

          {/* 右侧：结果区 */}
          <div>
            {matchResult ? (
              <div className="space-y-6">
                {/* 匹配度得分 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-600" />
                    匹配度分析
                  </h3>
                  
                  <div className="text-center mb-6">
                    <div className={`text-5xl font-bold ${getScoreColor(matchResult.score)}`}>
                      {matchResult.score}%
                    </div>
                    <p className="text-gray-600 mt-2">总体匹配度</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">匹配的关键词</p>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.matched.slice(0, 10).map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">缺失的关键词</p>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.missing.slice(0, 10).map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 差距分析 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                    差距分析
                  </h3>
                  
                  <div className="space-y-3">
                    {matchResult.gaps.map((gap, index) => (
                      <div key={index} className="border-l-4 border-orange-400 pl-4 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{gap.category}</h4>
                          <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(gap.priority)}`}>
                            {gap.priority === 'high' ? '高优先级' : gap.priority === 'medium' ? '中优先级' : '低优先级'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{gap.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 优化建议 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    优化建议
                  </h3>
                  
                  <ul className="space-y-2">
                    {matchResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => navigate('/editor')}
                    className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    返回编辑器优化简历
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">粘贴职位描述，开始智能匹配分析</p>
                <p className="text-sm text-gray-500 mt-2">
                  AI将分析你的简历与目标职位的匹配度，并提供优化建议
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
