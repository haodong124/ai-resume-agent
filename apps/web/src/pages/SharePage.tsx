// apps/web/src/pages/SharePage.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Download, Eye, Share2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface SharedResume {
  id: string
  title: string
  ownerName: string
  content: any
  createdAt: string
  viewCount: number
}

const SharePage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [resume, setResume] = useState<SharedResume | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSharedResume()
  }, [id])

  const loadSharedResume = async () => {
    try {
      // 模拟加载共享简历
      setTimeout(() => {
        setResume({
          id: id || '1',
          title: '软件工程师简历',
          ownerName: '张三',
          content: {
            personalInfo: {
              name: '张三',
              email: 'zhangsan@example.com',
              phone: '13800138000',
              location: '北京'
            },
            experience: [
              {
                company: '科技公司',
                position: '高级软件工程师',
                startDate: '2020-03',
                endDate: '至今',
                description: '负责核心系统架构设计和开发'
              }
            ]
          },
          createdAt: '2024-01-10',
          viewCount: 128
        })
        setLoading(false)
      }, 1500)
    } catch (error) {
      toast.error('加载失败')
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success('链接已复制')
  }

  const handleDownload = () => {
    toast.success('开始下载...')
    // 实际下载逻辑
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            简历不存在或已过期
          </h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部栏 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {resume.title}
              </h1>
              <span className="ml-4 text-sm text-gray-600">
                由 {resume.ownerName} 分享
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopyLink}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                下载 PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 简历内容 */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 个人信息 */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {resume.content.personalInfo.name}
            </h2>
            <div className="text-gray-600">
              <p>{resume.content.personalInfo.email}</p>
              <p>{resume.content.personalInfo.phone}</p>
              <p>{resume.content.personalInfo.location}</p>
            </div>
          </div>

          {/* 工作经验 */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              工作经验
            </h3>
            {resume.content.experience.map((exp: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {exp.position} - {exp.company}
                  </h4>
                  <span className="text-gray-600">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>

          {/* 底部信息 */}
          <div className="border-t pt-4 mt-8 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {resume.viewCount} 次查看
            </div>
            <div>
              分享于 {resume.createdAt}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SharePage
