import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Briefcase, Target, TrendingUp, AlertCircle } from 'lucide-react'

interface MatchResult {
  score: number
  matched: string[]
  missing: string[]
  suggestions: string[]
}

export default function JobsMatchPage() {
  const navigate = useNavigate()
  const [jobDescription, setJobDescription] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      alert('请填写简历和职位描述')
      return
    }

    setIsAnalyzing(true)
    
    // 模拟分析 - 实际应调用API
    setTimeout(() => {
      const mockResult: MatchResult = {
        score: Math.floor(Math.random() * 40) + 60,
        matched: ['React', 'TypeScript', '团队协作', '项目管理'],
        missing: ['Docker', 'Kubernetes', '英语流利'],
        suggestions: [
          '添加更多量化成果描述',
          '突出项目管理经验',
          '增加技术栈关键词',
          '优化工作经历描述'
        ]
      }
      setMatchResult(mockResult)
      setIsAnalyzing(false)
    }, 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">职位匹配分析</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 输入区 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                你的简历
              </h2>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="粘贴你的简历内容..."
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                职位描述
              </h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="粘贴职位JD..."
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isAnalyzing ? '分析中...' : '开始匹配分析'}
            </button>
          </div>

          {/* 结果区 */}
          <div>
            {matchResult ? (
              <div className="space-y-6">
                {/* 匹配度得分 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">匹配度分析</h3>
                  <div className="text-center mb-6">
                    <div className={`text-5xl font-bold ${getScoreColor(matchResult.score)}`}>
                      {matchResult.score}%
                    </div>
                    <p className="text-gray-600 mt-2">总体匹配度</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">✅ 匹配的关键词</p>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.matched.map((keyword, index) => (
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
                      <p className="text-sm text-gray-600 mb-1">❌ 缺失的关键词</p>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.missing.map((keyword, index) => (
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

                {/* 优化建议 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    优化建议
                  </h3>
                  <ul className="space-y-2">
                    {matchResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">填写简历和职位描述，开始智能匹配分析</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
