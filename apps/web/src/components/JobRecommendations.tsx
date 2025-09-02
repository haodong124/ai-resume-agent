// apps/web/src/components/JobRecommendations.tsx
import React, { useState, useEffect } from 'react'
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  ExternalLink,
  Loader2,
  RefreshCw,
  Filter,
  Star,
  Target
} from 'lucide-react'
import { useResumeStore } from '../features/resume/state'
import type { JobRecommendation } from '../types/resume'
import toast from 'react-hot-toast'
import JobDetailModal from './JobDetailModal'

export const JobRecommendations: React.FC = () => {
  const { resumeData } = useResumeStore()
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    location: '',
    salaryMin: 0,
    jobType: '',
    remote: false
  })
  const [selectedJob, setSelectedJob] = useState<JobRecommendation | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const fetchRecommendations = async () => {
    if (!resumeData.personalInfo.name) {
      toast.error('请先完善个人信息')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/.netlify/functions/recommend-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resumeData,
          options: {
            limit: 10,
            filters: filters.location ? filters : undefined
          }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setRecommendations(result.data)
        toast.success(`找到了 ${result.data.length} 个推荐职位！`)
      } else {
        throw new Error(result.error || '推荐失败')
      }
    } catch (error) {
      console.error('Job recommendations error:', error)
      toast.error('获取推荐失败，请重试')
      
      // 显示模拟数据以便测试
      setRecommendations([
        {
          jobId: '1',
          title: '前端开发工程师',
          company: '字节跳动',
          location: '北京',
          matchScore: 87,
          salaryRange: [25000, 40000],
          requiredSkills: ['JavaScript', 'React', 'TypeScript'],
          missingSkills: ['Vue.js'],
          reasons: [
            { type: 'skill_match', description: '技能匹配度高', weight: 0.8 },
            { type: 'experience_match', description: '工作经验符合要求', weight: 0.7 }
          ],
          growthPotential: 85,
          applicationUrl: 'https://jobs.bytedance.com/referral/pc/position  '
        },
        {
          jobId: '2',
          title: 'React开发工程师',
          company: '腾讯',
          location: '深圳',
          matchScore: 82,
          salaryRange: [22000, 35000],
          requiredSkills: ['React', 'JavaScript', 'Node.js'],
          missingSkills: ['GraphQL', 'Docker'],
          reasons: [
            { type: 'skill_match', description: 'React技能完美匹配', weight: 0.9 }
          ],
          growthPotential: 78
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const formatSalaryRange = (range?: [number, number]) => {
    if (!range) return '面议'
    return `${range[0].toLocaleString()} - ${range[1].toLocaleString()} 元/月`
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">职位推荐</h1>
            <p className="text-gray-600 mt-2">基于您的简历为您推荐最匹配的职位</p>
          </div>
          
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {loading ? '分析中...' : '重新分析'}
          </button>
        </div>

        {/* 筛选器 */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">期望城市</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="如：北京"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">最低薪资</label>
              <input
                type="number"
                value={filters.salaryMin || ''}
                onChange={(e) => setFilters({...filters, salaryMin: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="20000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">工作类型</label>
              <select
                value={filters.jobType}
                onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">不限</option>
                <option value="full-time">全职</option>
                <option value="part-time">兼职</option>
                <option value="contract">合同</option>
                <option value="internship">实习</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.remote}
                  onChange={(e) => setFilters({...filters, remote: e.target.checked})}
                  className="mr-2"
                />
                支持远程工作
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 推荐结果 */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">AI正在分析您的简历并匹配最适合的职位...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((job) => (
            <div key={job.jobId} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(job.matchScore)}`}>
                      {job.matchScore}% 匹配
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    {job.salaryRange && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatSalaryRange(job.salaryRange)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">成长潜力 {job.growthPotential}%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedJob(job)
                        setShowDetailModal(true)
                      }}
                      className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      查看详情
                    </button>
                    {job.applicationUrl && (
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        立即申请
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* 技能匹配分析 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-700 mb-2 flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    匹配技能
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.slice(0, 6).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-orange-700 mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    需要提升
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.missingSkills.slice(0, 4).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 推荐理由 */}
              {job.reasons && job.reasons.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-700 mb-2">推荐理由</h4>
                  <ul className="space-y-1">
                    {job.reasons.map((reason, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        {reason.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          
          {recommendations.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">暂无推荐职位</h3>
              <p>请完善您的简历信息后重新获取推荐</p>
            </div>
          )}
        </div>
      )}
      
      {/* 职位详情模态框 */}
      <JobDetailModal
        job={selectedJob}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedJob(null)
        }}
      />
    </div>
  )
}

export default JobRecommendations
