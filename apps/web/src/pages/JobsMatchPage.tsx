import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function JobsMatchPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">职位匹配分析</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-4">粘贴职位描述</h2>
          <textarea
            className="w-full h-64 p-4 border border-gray-300 rounded-lg"
            placeholder="将职位JD粘贴在这里..."
          />
          <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            开始分析
          </button>
        </div>
      </div>
    </div>
  )
}
