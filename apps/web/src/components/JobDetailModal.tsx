// apps/web/src/components/JobDetailModal.tsx
import React, { useState } from 'react'
import { 
  X, 
  ExternalLink, 
  MapPin, 
  DollarSign, 
  Clock,
  Star,
  Target,
  TrendingUp,
  Building,
  Users
} from 'lucide-react'
import type { JobRecommendation } from '../types/resume'

interface JobDetailModalProps {
  job: JobRecommendation | null
  isOpen: boolean
  onClose: () => void
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'preparation'>('overview')

  if (!isOpen || !job) return null

  const formatSalaryRange = (range?: [number, number]) => {
    if (!range) return '面议'
    return `${range[0].toLocaleString()} - ${range[1].toLocaleString()} 元/月`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                job.matchScore >= 80 ? 'bg-green-100 text-green-700' :
                job.matchScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {job.matchScore}% 匹配
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {job.company}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </div>
              {job.salaryRange && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {formatSalaryRange(job.salaryRange)}
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 标签导航 */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: '职位概述' },
            { id: 'analysis', label: '匹配分析' },
            { id: 'preparation', label: '准备建议' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-medium ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 关键信息 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">核心要求</h4>
                  <div className="space-y-2">
                    {job.requiredSkills.slice(0, 8).map((skill, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm mr-2 mb-2">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">发展前景</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">
                      成长潜力：{job.growthPotential}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    该职位在当前市场环境下具有良好的发展前景
                  </p>
                </div>
              </div>

              {/* 推荐理由 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">推荐理由</h4>
                <div className="space-y-2">
                  {job.reasons.map((reason, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <span className="text-gray-700">{reason.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* 匹配度分析 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">技能匹配分析</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <div className={`text-4xl font-bold ${getScoreColor(job.matchScore)}`}>
                      {job.matchScore}%
                    </div>
                    <div className="text-gray-600">总体匹配度</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-green-700 mb-2">已具备技能</h5>
                      <div className="space-y-1">
                        {job.requiredSkills.filter(skill => 
                          !job.missingSkills.includes(skill)
                        ).map((skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-orange-700 mb-2">需要提升</h5>
                      <div className="space-y-1">
                        {job.missingSkills.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preparation' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">面试准备建议</h4>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-2">技术准备</h5>
                    <ul className="space-y-1 text-sm text-blue-800">
                      {job.missingSkills.slice(0, 3).map((skill, index) => (
                        <li key={index}>• 重点复习 {skill} 相关知识</li>
                      ))}
                      <li>• 准备相关项目经验的详细说明</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="font-medium text-green-900 mb-2">优势突出</h5>
                    <ul className="space-y-1 text-sm text-green-800">
                      {job.requiredSkills.slice(0, 3).map((skill, index) => (
                        <li key={index}>• 强调您在 {skill} 方面的经验</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部操作 */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <Clock className="w-4 h-4 inline mr-1" />
            建议准备时间：3-5天
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              关闭
            </button>
            {job.applicationUrl && (
              
                href={job.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                立即申请
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailModal
