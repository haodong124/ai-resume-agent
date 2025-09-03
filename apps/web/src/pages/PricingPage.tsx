// apps/web/src/pages/PricingPage.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, ArrowLeft } from 'lucide-react'

interface PricingPlan {
  name: string
  price: string
  period: string
  features: string[]
  limitations?: string[]
  recommended?: boolean
}

const PricingPage: React.FC = () => {
  const navigate = useNavigate()

  const plans: PricingPlan[] = [
    {
      name: '免费版',
      price: '¥0',
      period: '永久免费',
      features: [
        '创建 1 份简历',
        '基础模板',
        'PDF 导出',
        '基础 AI 建议'
      ],
      limitations: [
        '无 AI 优化',
        '无职位匹配',
        '无在线分享'
      ]
    },
    {
      name: '专业版',
      price: '¥29',
      period: '/月',
      features: [
        '无限简历',
        '所有高级模板',
        'AI 智能优化',
        '职位匹配分析',
        '在线分享链接',
        'Word/PDF 导出',
        'ATS 优化建议',
        '优先客服支持'
      ],
      recommended: true
    },
    {
      name: '企业版',
      price: '¥199',
      period: '/月',
      features: [
        '专业版所有功能',
        '团队协作',
        '批量导出',
        'API 接入',
        '定制模板',
        '专属客服',
        '数据分析报告',
        'SSO 单点登录'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                选择套餐
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            选择适合你的方案
          </h2>
          <p className="text-xl text-gray-600">
            无论你是求职者还是企业，我们都有适合的解决方案
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                plan.recommended ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    推荐
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                {plan.limitations?.map((limitation, index) => (
                  <div key={index} className="flex items-start">
                    <X className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                    <span className="text-gray-500">{limitation}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (plan.name === '免费版') {
                    navigate('/register')
                  } else {
                    navigate('/register?plan=' + plan.name)
                  }
                }}
                className={`w-full py-3 rounded-lg font-medium transition ${
                  plan.recommended
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.name === '免费版' ? '免费开始' : '立即订阅'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            所有付费套餐均享有 7 天免费试用
          </p>
          <p className="text-sm text-gray-500">
            无需信用卡 · 随时取消 · 无隐藏费用
          </p>
        </div>
      </div>
    </div>
  )
}

export default PricingPage
