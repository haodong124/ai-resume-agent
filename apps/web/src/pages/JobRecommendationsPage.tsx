// apps/web/src/pages/JobRecommendationsPage.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Briefcase,
  ExternalLink,
  Bookmark,
  Check,  // 替换 BookmarkCheck
  Filter,
  ChevronRight,
  Building2,
  Loader2
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface JobListing {
  id: string
  title: string
  company: string
  location: string
  salary_min?: number
  salary_max?: number
  salary_text?: string
  description?: string
  job_url: string
  skills: string[]
  posted_date: string
  scraped_at: string
  view_count: number
}

interface JobApplication {
  job_id: string
  status: string
}

const JobRecommendationsPage: React.FC = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(false)
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState({
    location: 'Brisbane',
    title: '',
    salary_min: 0
  })
  const [page, setPage] = useState(0)
  const pageSize = 12

  useEffect(() => {
    fetchJobs()
    fetchSavedJobs()
  }, [filters, page])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('job_listings')
        .select('*')
        .eq('is_active', true)
        .order('scraped_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1)

      // 应用筛选条件
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }
      if (filters.title) {
        query = query.ilike('title', `%${filters.title}%`)
      }
      if (filters.salary_min > 0) {
        query = query.gte('salary_min', filters.salary_min)
      }

      const { data, error } = await query

      if (error) {
        console.error('获取职位失败:', error)
        toast.error('获取职位失败')
      } else {
        setJobs(data || [])
      }
    } catch (error) {
      console.error('获取职位失败:', error)
      toast.error('获取职位失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedJobs = async () => {
    try {
      const user = await supabase.auth.getUser()
      if (!user.data.user) return

      const { data } = await supabase
        .from('job_applications')
        .select('job_id')
        .eq('user_id', user.data.user.id)

      if (data) {
        setSavedJobs(new Set(data.map(item => item.job_id)))
      }
    } catch (error) {
      console.error('获取收藏职位失败:', error)
    }
  }

  const toggleSaveJob = async (jobId: string) => {
    try {
      const user = await supabase.auth.getUser()
      if (!user.data.user) {
        toast.error('请先登录')
        navigate('/login')
        return
      }

      if (savedJobs.has(jobId)) {
        // 取消收藏
        await supabase
          .from('job_applications')
          .delete()
          .eq('job_id', jobId)
          .eq('user_id', user.data.user.id)

        setSavedJobs(prev => {
          const newSet = new Set(prev)
          newSet.delete(jobId)
          return newSet
        })
        toast.success('已取消收藏')
      } else {
        // 添加收藏
        await supabase
          .from('job_applications')
          .insert({
            job_id: jobId,
            user_id: user.data.user.id,
            status: 'saved'
          })

        setSavedJobs(prev => new Set(prev).add(jobId))
        toast.success('已收藏职位')
      }
    } catch (error) {
      console.error('保存职位失败:', error)
      toast.error('操作失败')
    }
  }

  const handleApply = async (job: JobListing) => {
    // 记录点击
    await supabase
      .from('job_listings')
      .update({ view_count: job.view_count + 1 })
      .eq('id', job.id)

    // 打开职位链接
    window.open(job.job_url, '_blank')
  }

  const handleSearch = () => {
    setPage(0)
    fetchJobs()
  }

  const formatSalary = (min?: number, max?: number, text?: string) => {
    if (text) return text
    if (!min && !max) return '面议'
    if (min && max) return `$${(min/1000).toFixed(0)}k - $${(max/1000).toFixed(0)}k/年`
    if (min) return `$${(min/1000).toFixed(0)}k+/年`
    return '面议'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">职位推荐</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              返回仪表板
            </button>
          </div>
        </div>
      </header>

      {/* 搜索栏 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 职位搜索 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="职位名称"
                value={filters.title}
                onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 地点 */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="工作地点"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 最低薪资 */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                placeholder="最低年薪 (AUD)"
                value={filters.salary_min || ''}
                onChange={(e) => setFilters({ ...filters, salary_min: parseInt(e.target.value) || 0 })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 搜索按钮 */}
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              搜索职位
            </button>
          </div>
        </div>
      </div>

      {/* 职位列表 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">暂无职位</h3>
            <p className="text-gray-600 mt-2">调整搜索条件试试</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  {/* 职位头部 */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building2 className="w-4 h-4 mr-1" />
                        <span className="text-sm">{job.company}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSaveJob(job.id)
                      }}
                      className="text-gray-400 hover:text-blue-600 transition"
                    >
                      {savedJobs.has(job.id) ? (
                        <Check className="w-5 h-5 text-blue-600" />  // 使用 Check 替代 BookmarkCheck
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* 职位信息 */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      {formatSalary(job.salary_min, job.salary_max, job.salary_text)}
                    </div>
                  </div>

                  {/* 技能标签 */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{job.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 职位描述 */}
                  {job.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {job.description}
                    </p>
                  )}

                  {/* 操作按钮 */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-xs text-gray-500">
                      {new Date(job.posted_date).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleApply(job)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      查看详情
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页 */}
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <span className="flex items-center px-4">
                第 {page + 1} 页
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={jobs.length < pageSize}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default JobRecommendationsPage
