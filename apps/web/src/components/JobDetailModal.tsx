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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">职位描述</h4>
                <p className="text-gray-600">{job.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">技能要求</h4>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">福利待遇</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {job.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">匹配度分析</h4>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium">总体匹配度</span>
                    <span className={`text-3xl font-bold ${getScoreColor(job.matchScore)}`}>
                      {job.matchScore}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        job.matchScore >= 80 ? 'bg-green-500' :
                        job.matchScore >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${job.matchScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">技能匹配详情</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <h5 className="font-medium text-green-700">已匹配技能</h5>
                    </div>
                    <div className="space-y-2">
                      {job.matchedSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <h5 className="font-medium text-orange-700">需要提升</h5>
                    </div>
                    <div className="space-y-2">
                      {job.missingSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-gray-700">{skill}</span>
                        </div>
                      ))}
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
              <a
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
