// apps/web/src/components/JobRecommendations.tsx
import React, { useState, useEffect } from 'react'
import { MapPin, DollarSign, Clock, Star, TrendingUp } from 'lucide-react'

interface JobRecommendation {
  id: string
  title: string
  company: string
  location: string
  salaryMin?: number
  salaryMax?: number
  matchScore: number
  matchDetails: {
    skillMatch: number
    semanticSimilarity: number
    experienceMatch: number
    locationMatch: number
  }
  reasons: string[]
  improvements: string[]
  description: string
  requirements: any
}

const JobRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<JobRecommendation | null>(null)
  const [filters, setFilters] = useState({
    location: '',
    salaryMin: '',
    matchScore: 70
  })

  useEffect(() => {
    loadRecommendations()
  }, [filters])

  const loadRecommendations = async () => {
    try {
      setLoading(true)
      // 这里需要从localStorage或context获取用户的简历ID
      const resumeId = localStorage.getItem('currentResumeId')
      const userId = localStorage.getItem('userId')

      const response = await fetch('/.netlify/functions/recommend-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          userId,
          filters
        })
      })

      const result = await response.json()
      if (result.success) {
        setRecommendations(result.data.recommendations)
      }
    } catch (error) {
      console.error('加载推荐失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJobClick = (job: JobRecommendation) => {
    setSelectedJob(job)
    // 记录点击事件
    trackJobClick(job.id)
  }

  const trackJobClick = async (jobId: string) => {
    try {
      await fetch('/.netlify/functions/track-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'job_click',
          jobId,
          userId: localStorage.getItem('userId')
        })
      })
    } catch (error) {
      console.error('追踪失败:', error)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-blue-600 bg-blue-100'
    if (score >= 55) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return '薪资面议'
    if (!max) return `${(min! / 1000).toFixed(0)}K+`
    if (!min) return `最高${(max! / 1000).toFixed(0)}K`
    return `${(min! / 1000).toFixed(0)}K-${(max! / 1000).toFixed(0)}K`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">正在为您匹配最适合的职位...</span>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* 筛选器 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">筛选条件</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              地点
            </label>
            <select
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有地点</option>
              <option value="北京">北京</option>
              <option value="上海">上海</option>
              <option value="深圳">深圳</option>
              <option value="杭州">杭州</option>
              <option value="广州">广州</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最低薪资 (K)
            </label>
            <input
              type="number"
              value={filters.salaryMin}
              onChange={(e) => setFilters({...filters, salaryMin: e.target.value})}
              placeholder="例: 20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最低匹配度: {filters.matchScore}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={filters.matchScore}
              onChange={(e) => setFilters({...filters, matchScore: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 推荐结果 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((job) => (
          <div
            key={job.id}
            onClick={() => handleJobClick(job)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="p-6">
              {/* 职位标题和匹配度 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {job.title}
                  </h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(job.matchScore)}`}>
                  {job.matchScore}% 匹配
                </div>
              </div>

              {/* 基本信息 */}
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                {job.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </div>
                )}
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  全职
                </div>
              </div>

              {/* 匹配详情 */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span>技能匹配</span>
                  <div className="flex items-center">
                    <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${job.matchDetails.skillMatch}%` }}
                      />
                    </div>
                    <span className="text-gray-600">{job.matchDetails.skillMatch.toFixed(0)}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>经验匹配</span>
                  <div className="flex items-center">
                    <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${job.matchDetails.experienceMatch}%` }}
                      />
                    </div>
                    <span className="text-gray-600">{job.matchDetails.experienceMatch.toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* 匹配原因 */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">匹配原因:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {job.reasons.slice(0, 2).map((reason, index) => (
                    <li key={index} className="flex items-start">
                      <Star className="w-3 h-3 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 改进建议 */}
              {job.improvements.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">提升建议:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {job.improvements.slice(0, 2).map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <TrendingUp className="w-3 h-3 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button 
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(`/jobs/${job.id}`, '_blank')
                  }}
                >
                  查看详情
                </button>
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    // 添加到收藏
                  }}
                >
                  收藏
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无匹配职位</h3>
          <p className="text-gray-600 mb-4">
            尝试调整筛选条件或完善您的简历信息
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            完善简历
          </button>
        </div>
      )}
    </div>
  )
}

export default JobRecommendations
