import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MessageSquare, BarChart3, FileDown, Sparkles, CheckCircle, Zap } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      {/* 极简导航栏 */}
      <nav className="absolute top-0 w-full z-10 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-xl">ResumeAI</span>
          </div>
          <button className="text-gray-600 hover:text-gray-900 text-sm">
            登录
          </button>
        </div>
      </nav>

      {/* 英雄区 - 绝对核心 */}
      <section className="relative pt-32 pb-20 px-8">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* 主标题 */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            对话式AI简历助手
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              让你的职业生涯脱颖而出
            </span>
          </h1>

          {/* 副标题 */}
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            只需轻松对话，AI即可智能生成、分析并优化您的简历，轻松拿下梦想offer
          </p>

          {/* CTA按钮 - 超大且突出 */}
          <button
            onClick={() => navigate('/workspace')}
            className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="flex items-center gap-3">
              开始创作
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
          </button>

          {/* 信任指标 */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              免费使用
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              无需注册
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              5分钟完成
            </span>
          </div>
        </div>

        {/* 背景装饰 */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
      </section>

      {/* 功能亮点 - 极简三栏 */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          <div className={`text-center transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">智能对话引导</h3>
            <p className="text-gray-600">像朋友一样聊天，轻松填充经历</p>
          </div>

          <div className={`text-center transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">实时简历分析</h3>
            <p className="text-gray-600">AI即时评分，提供精准优化建议</p>
          </div>

          <div className={`text-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileDown className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">一键导出分享</h3>
            <p className="text-gray-600">生成专业PDF，直达招聘平台</p>
          </div>
        </div>
      </section>

      {/* 极简页脚 */}
      <footer className="absolute bottom-0 w-full py-6 text-center text-sm text-gray-400">
        © 2024 ResumeAI. All rights reserved.
      </footer>
    </div>
  )
}
