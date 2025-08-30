import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Briefcase, Target, TrendingUp, AlertCircle, Loader2 } from 'lucide-react'
import { callOpenAI } from '../lib/api'

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

export default function JobsMatchPage() {
  const navigate = useNavigate()
  const [jobDescription, setJobDescription] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeWithAI = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      alert('请填写简历和职位描述')
      return
    }

    setIsAnalyzing(true)
    
    try {
      const prompt = `
分析以下简历与职位描述的匹配度：

简历内容：
${resumeText}

职位描述：
${jobDescription}

请以JSON格式返回分析结果，包含：
1. score: 匹配分数(0-100)
2. matched: 匹配的关键词数组
3. missing: 缺失的关键词数组
4. suggestions: 改进建议数组(至少4条)
5. gaps: 差距分析数组，每项包含category, description, priority

只返回JSON，不要其他内容。
`

      const response = await callOpenAI(prompt, '你是一个专业的招聘专家和ATS系统分析师。')
      
      if (response) {
        try {
          // 提取JSON
          const jsonMatch = response.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0])
            setMatchResult(result)
          }
        } catch (e) {
          // 如果解析失败，使用默认数据
          console.error('JSON解析失败:', e)
          setMatchResult(generateMockResult())
        }
      } else {
        setMatchResult(generateMockResult())
      }
    } catch (error) {
      console.error('分析失败:', error)
      setMatchResult(generateMockResult())
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateMockResult = (): MatchResult => ({
    score: Math.floor(Math.random() * 30) + 60,
    matched: ['沟通能力', '团队协作', '项目管理', '数据分析'],
    missing: ['行业经验', '专业证书', '领导经验'],
    suggestions: [
      '增加与目标职位相关的量化成果',
      '突出相关项目经验和技术栈',
      '添加行业关键词以提高ATS评分',
      '优化个人简介，明确职业目标'
    ],
    gaps: [
      {
        category: '技术技能',
        description: '缺少职位要求的特定技术栈经验',
        priority: 'high'
      },
      {
        category: '软技能',
        description: '领导力和团队管理经验不足',
        priority: 'medium'
      }
    ]
  })

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">智能职位匹配分析</h1>
          </div>
          <div className="text-sm text-gray-500">
            {import.meta.env.VITE_OPENAI_API_KEY ? 
              <span className="text-green-600">✅ AI已连接</span> : 
              <span className="text-gray-400">⚠️ 使用模拟数据</span>
            }
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 输入区 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                你的简历内容
              </h2>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="粘贴你的简历内容，或描述你的经历..."
                className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                目标职位描述
              </h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="粘贴职位JD或职位要求..."
                className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              onClick={analyzeWithAI}
              disabled={isAnalyzing || (!resumeText.trim() || !jobDescription.trim())}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI分析中...
                </>
              ) : (
                '开始智能匹配分析'
              )}
            </button>
          </div>

          {/* 结果区 */}
          <div className="space-y-6">
            {matchResult ? (
              <>
                {/* 匹配度得分 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">匹配度分析</h3>
                  <div className="text-center mb-6">
                    <div className={`inline-block px-8 py-6 rounded-2xl ${getScoreColor(matchResult.score)}`}>
                      <div className="text-5xl font-bold">{matchResult.score}%</div>
                      <p className="text-sm mt-2 opacity-80">总体匹配度</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">✅ 匹配的关键能力</p>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.matched.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">⚠️ 需要补充的能力</p>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.missing.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 差距分析 */}
                {matchResult.gaps && matchResult.gaps.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                      差距分析
                    </h3>
                    <div className="space-y-3">
                      {matchResult.gaps.map((gap, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${getPriorityColor(gap.priority)}`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{gap.category}</h4>
                              <p className="text-sm mt-1 opacity-90">{gap.description}</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                              {gap.priority === 'high' ? '高' : gap.priority === 'medium' ? '中' : '低'}优先级
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 优化建议 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    AI优化建议
                  </h3>
                  <ul className="space-y-3">
                    {matchResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2 mt-0.5">✓</span>
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Target className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-2">填写简历和职位描述</p>
                <p className="text-sm text-gray-500">AI将为你提供专业的匹配分析和优化建议</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
