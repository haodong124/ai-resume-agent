// apps/web/src/components/JobMatchAnalysis.tsx
import React, { useState } from 'react'
import { Search, Target, TrendingUp, AlertCircle } from 'lucide-react'
import { useResumeStore } from '../features/resume/state'
import { apiService } from '../services/apiService'
import toast from 'react-hot-toast'
import type { JobMatchResult } from '../types/resume'

export const JobMatchAnalysis: React.FC = () => {
  const { resumeData } = useResumeStore()
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState<JobMatchResult | null>(null)
  const [loading, setLoading] = useState(false)

  const analyzeMatch = async () => {
    if (!jobDescription.trim()) {
      toast.error('请输入职位描述')
      return
    }

    if (!resumeData.personalInfo.name) {
      toast.error('请先完善简历信息')
      return
    }

    setLoading(true)
    try {
      const result = await apiService.analyzeJobMatch(resumeData, jobDescription)
      setAnalysis(result)
      toast.success('分析完成！')
    } catch (error) {
      console.error('Job match analysis error:', error)
      
      // 模拟数据用于测试
      setAnalysis({
        score: 75,
        matched: ['JavaScript', 'React', '团队合作'],
        missing: ['TypeScript', 'Node.js', 'Docker'],
        gaps: [
          {
            category: '技术技能',
            description: '缺少TypeScript和Node.js经验',
            priority: 'high'
          }
        ],
        suggestions: [
          '在技能部分添加TypeScript经验',
          '强调React项目经验',
          '添加团队协作的具体案例',
          '补充后端开发相关技能'
        ]
      })
      toast.success('使用模拟数据显示分析结果')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 输入区域 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">职位匹配分析</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">职位描述</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请粘贴您感兴趣的职位描述..."
            />
          </div>
          
          <button
            onClick={analyzeMatch}
            disabled={loading || !jobDescription.trim()}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                分析中...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                开始分析
              </>
            )}
          </button>
        </div>
      </div>

      {/* 分析结果 */}
      {analysis && (
        <div className="space-y-6">
          {/* 匹配度总览 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className={`text-4xl font-bold mb-2 ${
                analysis.score >= 80 ? 'text-green-600' :
                analysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {analysis.score}%
              </div>
              <div className="text-gray-600">职位匹配度</div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  匹配关键词 ({analysis.matched.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.matched.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  缺失关键词 ({analysis.missing.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 技能差距分析 */}
          {analysis.gaps && analysis.gaps.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">技能差距分析</h4>
              <div className="space-y-3">
                {analysis.gaps.map((gap, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    gap.priority === 'high' ? 'bg-red-50 border-red-400' :
                    gap.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                    'bg-blue-50 border-blue-400'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{gap.category}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        gap.priority === 'high' ? 'bg-red-100 text-red-700' :
                        gap.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {gap.priority === 'high' ? '高优先级' :
                         gap.priority === 'medium' ? '中优先级' : '低优先级'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{gap.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 优化建议 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              优化建议
            </h4>
            <div className="space-y-3">
              {analysis.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobMatchAnalysis
