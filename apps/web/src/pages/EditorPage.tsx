import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Save } from 'lucide-react'

export default function EditorPage() {
  const navigate = useNavigate()
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    title: ''
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">简历编辑器</h1>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Save className="w-4 h-4" />
              保存
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              导出PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 gap-8">
        {/* 左侧编辑区 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">基本信息</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓名
              </label>
              <input
                type="text"
                value={resumeData.name}
                onChange={(e) => setResumeData({...resumeData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入姓名"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                邮箱
              </label>
              <input
                type="email"
                value={resumeData.email}
                onChange={(e) => setResumeData({...resumeData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入邮箱"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                电话
              </label>
              <input
                type="tel"
                value={resumeData.phone}
                onChange={(e) => setResumeData({...resumeData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入电话"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                职位
              </label>
              <input
                type="text"
                value={resumeData.title}
                onChange={(e) => setResumeData({...resumeData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入目标职位"
              />
            </div>
          </div>
        </div>

        {/* 右侧预览区 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">实时预览</h2>
          
          <div className="border border-gray-200 rounded p-6">
            <h1 className="text-2xl font-bold">{resumeData.name || '你的名字'}</h1>
            <p className="text-gray-600">{resumeData.title || '目标职位'}</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>{resumeData.email || 'email@example.com'}</p>
              <p>{resumeData.phone || '138-0000-0000'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
