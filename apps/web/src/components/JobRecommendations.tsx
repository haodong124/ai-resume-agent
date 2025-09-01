// apps/web/src/components/JobRecommendations.tsx
import React, { useState, useEffect } from 'react'
import { Briefcase, MapPin, DollarSign, Star, TrendingUp, ExternalLink } from 'lucide-react'
import { useResumeStore } from '../store/resumeStore'

interface JobRecommendation {
  jobId: string
  title: string
  company: string
  location: string
  matchScore: number
  reasons: Array<{
    type: string
    description: string
    weight: number
  }>
  salaryRange?: [number, number]
  requiredSkills: string[]
  missingSkills: string[]
  growthPotential: number
  applicationUrl?: string
}

export const JobRecommendations: React.FC = () => {
  const { resumeData } = useResumeStore()
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [explanation, setExplanation] = useState<string>('')

  useEffect(() => {
    if (resumeData && Object.keys(resumeData).length > 0) {
      fetchRecommendations()
    }
  }, [resumeData])

  const fetchRecommendations = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/.netlify/functions/recommend-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resumeData,
          options: { limit: 6 }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setRecommendations(result.data)
      } else {
        setError(result.error || '获取推荐失败')
      }
    } catch (err) {
      setError('网络请求失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const explainRecommendation = async (jobId: string) => {
    try {
      const response = await fetch('/.netlify/functions/explain-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, resume: resumeData })
      })

      const result = await response.json()
      if (result.success) {
        setExplanation(result.explanation)
        setSelectedJob(jobId)
      }
    } catch (err) {
      console.error('获取推荐解释失败:', err)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-blue-600 bg-blue-100'
    if (score >= 55) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const formatSalary = (range?: [number, number]) => {
    if (!range) return '薪资面议'
    return `${(range[0] / 1000).toFixed(0)}K - ${(range[1] / 1000).toFixed(0)}K`
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在为你推荐匹配的职位...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchRecommendations}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">职位推荐</h1>
        <p className="text-gray-600">基于你的简历，为你推荐最匹配的职位机会</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((job) => (
          <div key={job.jobId} className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                  <p className="text-gray-600 font-medium">{job.company}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(job.matchScore)}`}>
                  {job.matchScore}% 匹配
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="text-sm">{formatSalary(job.salaryRange)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="text-sm">成长潜力 {job.growthPotential}%</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">所需技能:</p>
                <div className="flex flex-wrap gap-1">
                  {job.requiredSkills.slice(0, 4).map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{job.requiredSkills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {job.missingSkills.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">建议提升:</p>
                  <div className="flex flex-wrap gap-1">
                    {job.missingSkills.slice(0, 3).map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => explainRecommendation(job.jobId)}
                  className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm"
                >
                  查看匹配分析
                </button>
                {job.applicationUrl && (
                  
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    申请
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 推荐解释弹窗 */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">匹配分析</h2>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="whitespace-pre-line text-gray-700">
                {explanation}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
