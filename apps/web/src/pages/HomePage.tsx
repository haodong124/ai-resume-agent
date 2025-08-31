import React, { useState } from 'react'
import { 
  Sparkles, 
  FileText, 
  Target, 
  Zap, 
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  Globe,
  Shield,
  Clock,
  Download
} from 'lucide-react'

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)
  
  const features = [
    {
      icon: Sparkles,
      title: 'AI 智能优化',
      description: '使用GPT-4技术自动优化简历内容，提升ATS通过率',
      color: 'from-purple-500 to-pink-500',
      details: [
        '智能改写工作描述',
        '关键词优化建议',
        '语法和拼写检查',
        'ATS友好格式化'
      ]
    },
    {
      icon: Target,
      title: '职位匹配分析',
      description: '精准分析简历与目标职位的匹配度',
      color: 'from-blue-500 to-cyan-500',
      details: [
        '技能差距分析',
        '经验匹配度评分',
        '个性化改进建议',
        '行业关键词提取'
      ]
    },
    {
      icon: FileText,
      title: '专业模板库',
      description: '5种精心设计的专业模板，适配不同行业',
      color: 'from-green-500 to-emerald-500',
      details: [
        '现代简约风格',
        '传统商务风格',
        '创意设计风格',
        'ATS优化模板',
        '国际化模板'
      ]
    },
    {
      icon: Zap,
      title: '实时协作',
      description: '支持团队协作和实时预览',
      color: 'from-orange-500 to-red-500',
      details: [
        '实时预览更新',
        '多设备同步',
        '评论和反馈',
        '版本历史记录'
      ]
    }
  ]

  const stats = [
    { label: '活跃用户', value: '50K+', icon: Users },
    { label: '简历生成', value: '200K+', icon: FileText },
    { label: '成功率提升', value: '73%', icon: TrendingUp },
    { label: '用户满意度', value: '4.9/5', icon: Star }
  ]

  const processSteps = [
    {
      step: '1',
      title: '导入信息',
      description: '上传现有简历或填写基本信息',
      icon: Download
    },
    {
      step: '2',
      title: 'AI 优化',
      description: '智能分析并优化内容',
      icon: Sparkles
    },
    {
      step: '3',
      title: '选择模板',
      description: '挑选最适合的专业模板',
      icon: FileText
    },
    {
      step: '4',
      title: '导出分享',
      description: '一键导出PDF或在线分享',
      icon: Globe
    }
  ]

  const testimonials = [
    {
      name: '张明',
      role: '产品经理',
      company: '字节跳动',
      content: 'AI优化功能太强大了！帮我的简历提升了一个档次，面试邀请率提高了300%。',
      avatar: '👨‍💼',
      rating: 5
    },
    {
      name: '李华',
      role: '前端工程师',
      company: '阿里巴巴',
      content: '模板设计非常专业，而且ATS优化让我的简历能够顺利通过系统筛选。',
      avatar: '👩‍💻',
      rating: 5
    },
    {
      name: '王强',
      role: 'UI设计师',
      company: '腾讯',
      content: '职位匹配分析帮我找到了技能差距，针对性提升后成功拿到dream offer！',
      avatar: '🎨',
      rating: 5
    }
  ]

  const faqs = [
    {
      question: '需要付费吗？',
      answer: '基础功能完全免费，高级AI功能和更多模板需要升级专业版。'
    },
    {
      question: '支持哪些文件格式？',
      answer: '支持导入Word、PDF格式，导出支持PDF、PNG和在线链接分享。'
    },
    {
      question: 'AI优化需要多长时间？',
      answer: '通常在10-30秒内完成，具体时间取决于简历内容的复杂度。'
    },
    {
      question: '数据安全吗？',
      answer: '我们采用银行级加密技术，所有数据都严格保密，不会与第三方共享。'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold">AI Resume Pro</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition">功能</a>
              <a href="#process" className="text-gray-600 hover:text-purple-600 transition">流程</a>
              <a href="#testimonials" className="text-gray-600 hover:text-purple-600 transition">评价</a>
              <a href="#faq" className="text-gray-600 hover:text-purple-600 transition">FAQ</a>
            </div>
            <button
              onClick={() => window.location.href = '/editor'}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              开始使用
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-6">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">2024年度最佳AI简历工具</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI驱动的
              </span>
              <br />
              智能简历制作平台
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              让人工智能帮你打造完美简历，提升求职成功率
              <br />
              已帮助超过50,000名用户成功获得心仪工作
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => window.location.href = '/editor'}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all text-lg font-semibold flex items-center justify-center gap-2"
              >
                免费开始制作
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
              
              <button
                onClick={() => window.location.href = '/jobs-match'}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-purple-600 hover:text-purple-600 transition-all text-lg font-semibold"
              >
                职位匹配测试
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">企业级安全</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm">24/7支持</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span className="text-sm">支持中英文</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-md mb-3">
                  <stat.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">强大功能，助力求职</h2>
            <p className="text-xl text-gray-600">全方位的AI技术支持，让简历制作变得简单高效</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`p-6 rounded-xl cursor-pointer transition-all ${
                    activeFeature === index
                      ? 'bg-white shadow-xl scale-105'
                      : 'bg-gray-50 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                      {activeFeature === index && (
                        <ul className="mt-4 space-y-2">
                          {feature.details.map((detail, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8">
                <img
                  src="https://via.placeholder.com/600x400/e9d5ff/9333ea?text=Resume+Preview"
                  alt="Resume Preview"
                  className="rounded-xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">简单四步，完成专业简历</h2>
            <p className="text-xl text-gray-600">智能化流程，让简历制作更轻松</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-transparent" />
                )}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-lg mb-4">
                    <step.icon className="w-10 h-10 text-purple-600" />
                  </div>
                  <div className="text-purple-600 font-bold text-sm mb-2">步骤 {step.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">用户好评如潮</h2>
            <p className="text-xl text-gray-600">来自真实用户的成功故事</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role} @ {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">常见问题</h2>
            <p className="text-xl text-gray-600">解答你的疑问</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            准备好获得你的Dream Offer了吗？
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            立即开始，让AI帮你打造完美简历
          </p>
          
          <button
            onClick={() => window.location.href = '/editor'}
            className="px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition text-lg font-semibold inline-flex items-center gap-2 shadow-xl"
          >
            立即免费开始
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="mt-8 flex items-center justify-center gap-6 text-purple-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>无需信用卡</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>永久免费基础版</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>5分钟完成</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <span className="text-white font-bold">AI Resume Pro</span>
              </div>
              <p className="text-sm">让AI助力你的职业发展</p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/editor" className="hover:text-white transition">简历编辑器</a></li>
                <li><a href="/jobs-match" className="hover:text-white transition">职位匹配</a></li>
                <li><a href="#" className="hover:text-white transition">模板库</a></li>
                <li><a href="#" className="hover:text-white transition">AI优化</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">资源</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">使用指南</a></li>
                <li><a href="#" className="hover:text-white transition">简历技巧</a></li>
                <li><a href="#" className="hover:text-white transition">职场资讯</a></li>
                <li><a href="#" className="hover:text-white transition">成功案例</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">关于</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">关于我们</a></li>
                <li><a href="#" className="hover:text-white transition">联系我们</a></li>
                <li><a href="#" className="hover:text-white transition">隐私政策</a></li>
                <li><a href="#" className="hover:text-white transition">服务条款</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 AI Resume Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
