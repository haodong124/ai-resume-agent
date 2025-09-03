// apps/web/src/pages/DashboardPage.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FileText, 
  Plus, 
  Clock, 
  Star,
  TrendingUp,
  Download,
  Briefcase,
  MessageSquare
} from 'lucide-react'

interface ResumeItem {
  id: string
  title: string
  updatedAt: string
  score: number
  status: 'draft' | 'completed'
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  
  // 模拟数据
  const resumes: ResumeItem[] = [
    {
      id: '1',
      title: '软件工程师简历',
      updatedAt: '2024-01-10',
      score: 85,
      status: 'completed'
    },
    {
      id: '2',
      title: '产品经理简历',
      updatedAt: '2024-01-08',
      score: 72,
      status: 'draft'
    }
  ]

  const stats = {
    totalResumes: 2,
    avgScore: 78.5,
    applications: 5,
    interviews: 2
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">我的仪表板</h1>
            <button
              onClick={() => navigate('/editor')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              创建新简历
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="w-10 h-10 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">简历总数</p>
                <p className="text-2xl font-semibold">{stats.totalResumes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Star className="w-10 h-10 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">平均评分</p>
                <p className="text-2xl font-semibold">{stats.avgScore}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Briefcase className="w-10 h-10 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">投递次数</p>
                <p className="text-2xl font-semibold">{stats.applications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="w-10 h-10 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">面试邀请</p>
                <p className="text-2xl font-semibold">{stats.interviews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/editor')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center justify-between"
          >
            <div className="flex items-center">
              <Plus className="w-8 h-8 text-blue-600" />
              <span className="ml-3 text-lg font-medium">创建新简历</span>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/career-chat')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center justify-between"
          >
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-green-600" />
              <span className="ml-3 text-lg font-medium">AI 职业顾问</span>
            </div>
          </button>
          
          <button
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center justify-between"
          >
            <div className="flex items-center">
              <Download className="w-8 h-8 text-purple-600" />
              <span className="ml-3 text-lg font-medium">导入简历</span>
            </div>
          </button>
        </div>

        {/* 简历列表 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">我的简历</h2>
          </div>
          <div className="divide-y">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/editor/${resume.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">{resume.title}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        更新于 {resume.updatedAt}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-blue-600">{resume.score}%</p>
                      <p className="text-xs text-gray-600">匹配度</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      resume.status === 'completed' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {resume.status === 'completed' ? '已完成' : '草稿'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
