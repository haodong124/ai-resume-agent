// apps/web/src/components/JobRecommendations.tsx
import React, { useState, useEffect } from 'react'
import { MapPin, DollarSign, Clock, Star, TrendingUp, Loader2, RefreshCw } from 'lucide-react'
import { useResumeStore } from '../features/resume/state'
import toast from 'react-hot-toast'

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
  const { resumeData } = useResumeStore()
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<JobRecommendation | null>(null)
  const [filters, setFilters] = useState({
    location: '',
    salaryMin: '',
    matchScore: 70
  })

  // 初始化时从简历数据设置默认值
  useEffect(() => {
    // 从localStorage获取用户数据或使用当前简历数据
    const savedLocation = localStorage.getItem('userLocation') || resumeData.personalInfo.location
    const savedJobTitle = localStorage.getItem('userJobTitle') || resumeData.personalInfo.title

    setFilters(prev => ({
      ...prev,
      location: savedLocation || 'Brisbane'
    }))

    console.log('加载用户职位信息:', {
      title: savedJobTitle,
      location: savedLocation,
      skills: resumeData.skills
    })
  }, [resumeData])

  useEffect(() => {
    loadRecommendations()
  }, [filters])

  const loadRecommendations = async () => {
    try {
      setLoading(true)

      // 获取简历ID和数据
      let resumeId = localStorage.getItem('currentResumeId')
      let currentResumeData = resumeData

      // 如果localStorage中有保存的数据，优先使用
      const savedResumeData = localStorage.getItem('resumeData')
      if (savedResumeData) {
        try {
          currentResumeData = JSON.parse(savedResumeData)
        } catch (e) {
          console.error('解析保存的简历数据失败:', e)
        }
      }

      // 如果没有resumeId，生成一个
      if (!resumeId && currentResumeData.personalInfo.name) {
        resumeId = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('currentResumeId', resumeId)
      }

      // 从简历中提取用户的职位信息
      const userJobTitle = currentResumeData.personalInfo.title || localStorage.getItem('userJobTitle') || ''
      const userLocation = filters.location || currentResumeData.personalInfo.location || 'Brisbane'
      const userSkills = currentResumeData.skills || []

      console.log('发送推荐请求:', {
        resumeId,
        userJobTitle,
        userLocation,
        skills: userSkills.length
      })

      const response = await fetch('/.netlify/functions/recommend-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          resumeData: currentResumeData,
          userContext: {
            title: userJobTitle,
            location: userLocation,
            skills: userSkills
          },
          filters: {
            ...filters,
            location: userLocation,
            jobTitle: userJobTitle // 传递职位信息用于过滤
          }
        })
      })

      const result = await response.json()
      if (result.success) {
        // 如果没有找到相关职位，生成模拟数据
        if (!result.data.recommendations || result.data.recommendations.length === 0) {
          const mockRecommendations = generateMockRecommendations(userJobTitle, userLocation, userSkills)
          setRecommendations(mockRecommendations)
          toast('暂无真实数据，显示模拟推荐')
        } else {
          setRecommendations(result.data.recommendations)
        }
      } else {
        // 使用模拟数据
        const mockRecommendations = generateMockRecommendations(userJobTitle, userLocation, userSkills)
        setRecommendations(mockRecommendations)
      }
    } catch (error) {
      console.error('加载推荐失败:', error)
      // 错误时使用模拟数据
      const userJobTitle = resumeData.personalInfo.title || '软件工程师'
      const userLocation = filters.location || resumeData.personalInfo.location || 'Brisbane'
      const mockRecommendations = generateMockRecommendations(userJobTitle, userLocation, resumeData.skills)
      setRecommendations(mockRecommendations)
      toast.error('加载失败，显示模拟数据')
    } finally {
      setLoading(false)
    }
  }

  // 生成模拟推荐（基于用户的实际职位）
  const generateMockRecommendations = (
    jobTitle: string, 
    location: string, 
    skills: any[]
  ): JobRecommendation[] => {
    const baseTitle = jobTitle || '工程师'
    const baseLocation = location || 'Brisbane'
    
    // 根据用户职位生成相关的模拟职位
    const relatedTitles = [
      baseTitle,
      `高级${baseTitle}`,
      `${baseTitle}主管`,
      `${baseTitle}专家`,
      `初级${baseTitle}`
    ]

    return relatedTitles.map((title, index) => ({
      id: `mock-${index}`,
      title,
      company: `科技公司${index + 1}`,
      location: baseLocation,
      salaryMin: 80000 + index * 20000,
      salaryMax: 120000 + index * 20000,
      matchScore: 95 - index * 5,
      matchDetails: {
        skillMatch: 90 - index * 5,
        semanticSimilarity: 85 - index * 5,
        experienceMatch: 80 - index * 5,
        locationMatch: 100
      },
      reasons: [
        `职位与您的"${jobTitle}"背景高度匹配`,
        `地点在${baseLocation}`,
        skills.length > 0 ? `技能匹配: ${skills.slice(0, 3).map(s => s.name || s).join(', ')}` : '职位要求符合'
      ],
      improvements: ['可以增加更多项目经验', '建议获得相关认证'],
      description: `寻找经验丰富的${title}加入我们的团队`,
      requirements: {}
    }))
  }

  const handleJobClick = (job: JobRecommendation) => {
    setSelectedJob(job)
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            职位推荐
            {resumeData.personalInfo.title && (
              <span className="text-sm text-gray-500 ml-2">
                基于您的职位: {resumeData.personalInfo.title}
              </span>
            )}
          </h2>
          <button
            onClick={loadRecommendations}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </button>
        </div>

        {/* 筛选器 */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                地点
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={resumeData.personalInfo.location || "Brisbane"}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最低年薪
              </label>
              <input
                type="number"
                value={filters.salaryMin}
                onChange={(e) => setFilters({...filters, salaryMin: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="80000"
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
      </div>

      {/* 推荐结果 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations
          .filter(job => job.matchScore >= filters.matchScore)
          .map((job) => (
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

              {/* 匹配原因 */}
              <div className="space-y-2">
                {job.reasons.slice(0, 3).map((reason, index) => (
                  <div key={index} className="flex items-start text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.filter(job => job.matchScore >= filters.matchScore).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">没有找到匹配的职位</p>
          <p className="text-sm text-gray-400">请尝试调整筛选条件</p>
        </div>
      )}

      {/* 选中职位的详情模态框 */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                <p className="text-gray-600">{selectedJob.company}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">职位描述</h3>
                <p className="text-gray-600">{selectedJob.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">匹配详情</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">技能匹配</span>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${selectedJob.matchDetails.skillMatch}%`}}
                        />
                      </div>
                      <span className="text-sm">{selectedJob.matchDetails.skillMatch}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">地点匹配</span>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{width: `${selectedJob.matchDetails.locationMatch}%`}}
                        />
                      </div>
                      <span className="text-sm">{selectedJob.matchDetails.locationMatch}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">改进建议</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {selectedJob.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobRecommendations
