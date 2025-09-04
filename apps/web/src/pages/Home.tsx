// apps/web/src/pages/Home.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { 
  FileText, Briefcase, MessageSquare, Award, BookOpen,
  TrendingUp, Users, Target, Calendar, ArrowRight, Plus
} from 'lucide-react'

const Home: React.FC = () => {
  const [stats, setStats] = useState({
    totalResumes: 0,
    jobApplications: 0,
    interviewsPracticed: 0,
    skillsAnalyzed: 0
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 加载用户统计数据
      const [resumesResult, recommendationsResult, interviewsResult] = await Promise.all([
        supabase.from('resumes').select('id').eq('user_id', user.id),
        supabase.from('job_recommendations').select('id').eq('user_id', user.id),
        supabase.from('interview_sessions').select('id').eq('user_id', user.id)
      ])

      setStats({
        totalResumes: resumesResult.data?.length || 0,
        jobApplications: recommendationsResult.data?.length || 0,
        interviewsPracticed: interviewsResult.data?.length || 0,
        skillsAnalyzed: 12 // 示例数据
      })

      // 加载最近活动
      setRecentActivities([
        { type: 'resume', action: '更新了简历', time: '2小时前', icon: FileText },
        { type: 'job', action: '查看了前端工程师职位', time: '5小时前', icon: Briefcase },
        { type: 'interview', action: '完成了模拟面试', time: '1天前', icon: Award },
        { type: 'skills', action: '分析了技能差距', time: '2天前', icon: BookOpen }
      ])

      // 加载待办任务
      setUpcomingTasks([
        { title: '完善简历项目经历', priority: 'high', dueDate: '今天' },
        { title: '练习React面试题', priority: 'medium', dueDate: '明天' },
        { title: '学习TypeScript基础', priority: 'low', dueDate: '本周' }
      ])

    } catch (error) {
      console.error('加载仪表板数据失败:', error)
    }
  }

  const quickActions = [
    {
      title: '创建新简历',
      description: '使用AI助手快速创建专业简历',
      icon: FileText,
      color: 'blue',
      action: () => navigate('/editor')
    },
    {
      title: '职位推荐',
      description: '获取个性化职位匹配',
      icon: Briefcase,
      color: 'green',
      action: () => navigate('/jobs')
    },
    {
      title: '模拟面试',
      description: '练习面试技巧和回答',
      icon: Award,
      color: 'purple',
      action: () => navigate('/interview')
    },
    {
      title: '技能分析',
      description: '分析技能差距和学习路径',
      icon: BookOpen,
      color: 'orange',
      action: () => navigate('/skills')
    }
  ]

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityText = (priority: string) => {
    const texts = {
      high: '高优先级',
      medium: '中优先级',
      low: '低优先级'
    }
    return texts[priority as keyof typeof texts] || '普通'
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 欢迎区域 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          欢迎回来！👋
        </h1>
        <p className="text-lg text-gray-600">
          继续您的职业发展之路，AI助手随时为您服务
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">简历数量</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalResumes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">职位申请</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.jobApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">面试练习</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.interviewsPracticed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">技能分析</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.skillsAnalyzed}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 快速操作 */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">快速开始</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center mb-3">
                  <div className={`p-2 bg-${action.color}-100 rounded-lg group-hover:bg-${action.color}-200 transition-colors`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            ))}
          </div>

          {/* 最近活动 */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">最近活动</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <activity.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {recentActivities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>暂无最近活动</p>
                  <p className="text-sm">开始使用AI助手来记录您的进展</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 待办任务 */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">待办任务</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                        {getPriorityText(task.priority)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">截止日期: {task.dueDate}</p>
                  </div>
                ))}
              </div>

              {upcomingTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">暂无待办任务</p>
                </div>
              )}
            </div>
          </div>

          {/* 技能进度 */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">技能进度</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">JavaScript</span>
                    <span className="text-sm text-gray-500">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">React</span>
                    <span className="text-sm text-gray-500">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">TypeScript</span>
                    <span className="text-sm text-gray-500">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/skills')}
                className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                查看详细分析 →
              </button>
            </div>
          </div>

          {/* AI建议 */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white p-6">
            <h3 className="text-lg font-semibold mb-2">💡 AI建议</h3>
            <p className="text-sm text-purple-100 mb-4">
              基于您的简历分析，建议加强TypeScript技能，这将显著提升您的求职竞争力。
            </p>
            <button 
              onClick={() => navigate('/career-chat')}
              className="text-sm font-medium bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
            >
              获取更多建议
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
