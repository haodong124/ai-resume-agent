import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 动画图标 */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-200 mb-4 animate-bounce">
            404
          </div>
          <div className="text-6xl mb-4">🔍</div>
        </div>

        {/* 错误信息 */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          页面未找到
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          抱歉，您访问的页面不存在或已被移动
        </p>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Home className="w-5 h-5" />
            返回首页
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-purple-600 hover:text-purple-600 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            返回上页
          </button>
        </div>

        {/* 建议链接 */}
        <div className="mt-12 text-gray-600">
          <p className="mb-4">您可能想要访问：</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/editor')}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              简历编辑器
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => navigate('/jobs-match')}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              职位匹配
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => navigate('/skills')}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              技能推荐
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
