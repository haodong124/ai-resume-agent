import { useState } from 'react'
import { X, Send, Star, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    rating: 0,
    comment: '',
    isPublic: false, // 改为 boolean 类型
    aiSkillMatch: '',
    contentQuality: '',
    sitePerformance: '',
    recommendation: '',
    aiAdvantages: [] as string[],
    improvementAreas: [] as string[],
    usageFrequency: '',
    featureRequests: '',
    siteIssues: [] as string[],
    siteIssuesOther: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingClick = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }))
  }

  const handleCheckboxChange = (field: 'aiAdvantages' | 'improvementAreas' | 'siteIssues', value: string) => {
    setFeedback(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!feedback.rating) {
      toast.error('请选择评分')
      return
    }

    if (!feedback.comment.trim()) {
      toast.error('请输入反馈内容')
      return
    }

    setIsSubmitting(true)
    try {
      // 模拟提交
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('感谢您的反馈！')
      onClose()
      // 重置表单
      setFeedback({
        name: '',
        email: '',
        rating: 0,
        comment: '',
        isPublic: false,
        aiSkillMatch: '',
        contentQuality: '',
        sitePerformance: '',
        recommendation: '',
        aiAdvantages: [],
        improvementAreas: [],
        usageFrequency: '',
        featureRequests: '',
        siteIssues: [],
        siteIssuesOther: ''
      })
    } catch (error) {
      toast.error('提交失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              用户反馈
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 评分 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              您对我们的服务满意度如何？*
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="p-2 transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= feedback.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                姓名（可选）
              </label>
              <input
                type="text"
                value={feedback.name}
                onChange={(e) => setFeedback(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="您的姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                邮箱（可选）
              </label>
              <input
                type="email"
                value={feedback.email}
                onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* 反馈内容 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              反馈内容 *
            </label>
            <textarea
              value={feedback.comment}
              onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg resize-none"
              rows={4}
              placeholder="请告诉我们您的想法..."
              required
            />
          </div>

          {/* AI功能反馈 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              AI功能体验如何？
            </label>
            <select
              value={feedback.aiSkillMatch}
              onChange={(e) => setFeedback(prev => ({ ...prev, aiSkillMatch: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">请选择</option>
              <option value="excellent">非常准确</option>
              <option value="good">比较准确</option>
              <option value="average">一般</option>
              <option value="poor">不太准确</option>
              <option value="not-used">未使用</option>
            </select>
          </div>

          {/* 改进建议 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              您希望我们改进哪些方面？
            </label>
            <div className="space-y-2">
              {['界面设计', '功能完善', '性能优化', 'AI准确度', '模板样式'].map(area => (
                <label key={area} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={feedback.improvementAreas.includes(area)}
                    onChange={() => handleCheckboxChange('improvementAreas', area)}
                    className="rounded"
                  />
                  <span className="text-sm">{area}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 是否公开 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={feedback.isPublic}
              onChange={(e) => setFeedback(prev => ({ 
                ...prev, 
                isPublic: e.target.checked // 直接使用 boolean 值
              }))}
              className="rounded"
            />
            <label htmlFor="isPublic" className="text-sm">
              允许我们公开展示这条反馈（将隐藏个人信息）
            </label>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? '提交中...' : '提交反馈'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
