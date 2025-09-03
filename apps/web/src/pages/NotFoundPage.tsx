// apps/web/src/pages/NotFoundPage.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <p className="text-2xl font-semibold text-gray-800 mt-4">
            页面未找到
          </p>
          <p className="text-gray-600 mt-2">
            抱歉，您访问的页面不存在或已被移除。
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-lg shadow hover:shadow-md transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回上一页
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            <Home className="w-5 h-5 mr-2" />
            返回首页
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          如果您认为这是一个错误，请联系我们的支持团队。
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
