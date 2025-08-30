import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Sparkles, Target, Download, Zap, Shield } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI Resume Agent
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            智能简历制作平台 - 让AI帮你打造完美简历
          </p>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/editor')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              开始制作简历
            </button>
            <button
              onClick={() => navigate('/jobs-match')}
              className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Target className="w-5 h-5" />
              职位匹配分析
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI 智能优化</h3>
            <p className="text-gray-600">
              自动优化简历内容，提升ATS通过率，让你的简历脱颖而出
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">职位匹配分析</h3>
            <p className="text-gray-600">
              分析简历与目标职位的匹配度，提供精准的优化建议
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">高质量导出</h3>
            <p className="text-gray-600">
              支持PDF高清导出，完美兼容各大招聘网站
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">多模板支持</h3>
            <p className="text-gray-600">
              5种专业模板，适配不同行业和职位需求
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">隐私保护</h3>
            <p className="text-gray-600">
              数据本地存储，确保你的个人信息安全
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">实时预览</h3>
            <p className="text-gray-600">
              编辑即时预览效果，所见即所得
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold mb-4">准备好了吗？</h2>
          <p className="text-xl text-gray-600 mb-8">
            开始使用AI Resume Agent，让求职更简单
          </p>
          <button
            onClick={() => navigate('/editor')}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-lg"
          >
            立即开始
          </button>
        </div>
      </div>
    </div>
  )
}
