// HomePage.tsx - 应用主页
// 文件路径: apps/web/src/pages/HomePage.tsx

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  FileText, 
  Target, 
  Zap, 
  Users,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'
import { useResumeStore } from '../features/resume/state'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { resumeData } = useResumeStore()
  
  const hasResumeData = resumeData.personalInfo.name || 
                       resumeData.experience.length > 0 || 
                       resumeData.education.length > 0

  const features = [
    {
      icon: Sparkles,
      title: 'AI 智能优化',
      description: '使用先进的AI技术自动优化简历内容，提升ATS通过率',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Target,
      title: '职位匹配分析',
      description: '精准分析简历与目标职位的匹配度，提供针对性建议',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FileText,
      title: '多种模板',
      description: '提供5种专业模板，适配不同行业和职位需求',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Zap,
      title: '实时预览',
      description: '编辑即时生效，所见即所得的简历制作体验',
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  const stats = [
    { label: '用户信赖', value: '10,000+' },
    { label: '简历生成', value: '50,000+' },
    { label: '成功入职', value: '8,000+' },
    { label: '平均提升', value: '40%' }
  ]

  const testimonials = [
    {
      name: '张小明',
      role: '软件工程师',
      company: '腾讯',
      content: 'AI简历助手帮我优化了工作描述，面试邀请增加了3倍！',
      avatar: '👨‍💻'
    },
    {
      name: '李小红',
      role: '产品经理',
      company: '字节跳动',
      content: '职位匹配分析很准确，让我知道该补充哪些技能。',
      avatar: '👩‍💼'
    },
    {
      name: '王小强',
      role: 'UI设计师',
      company: '美团',
      content: '模板很专业，简历颜值提升了不止一个档次。',
      avatar: '🎨'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                AI驱动的简历制作平台
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              让 <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">AI</span> 帮你制作
              <br />完美简历
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              智能优化内容，精准匹配职位，提升面试机会。
              让每一份简历都成为你职场成功的敲门砖。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/editor')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all text-lg font-semibold"
              >
                {hasResumeData ? '继续编辑简历' : '开始制作简历'}
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => navigate('/skills')}
                className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-purple-600 hover:text-purple-600 transition-all text-lg font-semibold"
              >
                <Target className="w-5 h-5" />
                技能推荐
              </button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-50 animate-bounce" />
          <div className="absolute top-40 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-50 animate-bounce delay-75" />
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-50 animate-bounce delay-150" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              为什么选择我们？
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              专业的AI技术与丰富的简历模板相结合，为你打造独一无二的求职利器
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              用户真实反馈
            </h2>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-gray-600">来自真实用户的五星好评</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role} @ {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            准备好制作完美简历了吗？
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            加入数万名成功求职者的行列，让AI为你的职业生涯加速
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-8">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white">完全免费</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white">无需注册</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white">立即使用</span>
          </div>
          
          <button
            onClick={() => navigate('/editor')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold shadow-lg"
          >
            立即开始制作
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  )
}
