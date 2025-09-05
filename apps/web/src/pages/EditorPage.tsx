// apps/web/src/pages/EditorPage.tsx
import React, { useState, useEffect, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Save, Download, Eye, EyeOff, Sparkles, 
  ChevronDown, Loader2, BarChart3, Target, MessageSquare
} from 'lucide-react'
import { useResumeStore } from '../features/resume/state'
import ResumeEditor from '../components/ResumeEditor'
import ResumeAnalyzer from '../components/ResumeAnalyzer'
import JobMatchAnalysis from '../components/JobMatchAnalysis'
import AIAssistant from '../components/AIAssistant'
import toast from 'react-hot-toast'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const StandardTemplate = lazy(() => import('../components/templates/StandardTemplate'))
const AmericanBusinessTemplate = lazy(() => import('../components/templates/AmericanBusinessTemplate'))

const TEMPLATES = {
  standard: { name: '标准模板', component: StandardTemplate },
  american: { name: '美式商务', component: AmericanBusinessTemplate },
}

const EditorPage: React.FC = () => {
  const navigate = useNavigate()
  const { resumeData, selectedTemplate, setTemplate } = useResumeStore()
  const [rightPanelContent, setRightPanelContent] = useState<'preview' | 'analyzer' | 'jobmatch' | 'ai'>('preview')
  const [isSaving, setIsSaving] = useState(false)

  // 页面加载时，确保简历ID存在
  useEffect(() => {
    const resumeId = localStorage.getItem('currentResumeId')
    if (!resumeId && resumeData.personalInfo.name) {
      // 如果没有ID但有数据，生成一个新ID
      const newResumeId = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('currentResumeId', newResumeId)
    }
  }, [resumeData])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 生成或获取简历ID
      let resumeId = localStorage.getItem('currentResumeId')
      if (!resumeId) {
        resumeId = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('currentResumeId', resumeId)
      }

      // 保存完整的简历数据
      localStorage.setItem('resumeData', JSON.stringify(resumeData))
      localStorage.setItem('currentResumeData', JSON.stringify(resumeData))
      localStorage.setItem('selectedTemplate', selectedTemplate)
      
      // 保存关键信息供其他功能使用
      localStorage.setItem('userJobTitle', resumeData.personalInfo.title || '')
      localStorage.setItem('userLocation', resumeData.personalInfo.location || '')
      localStorage.setItem('userSkills', JSON.stringify(resumeData.skills || []))
      
      // 如果有用户ID，也保存关联
      const userId = localStorage.getItem('userId')
      if (userId) {
        localStorage.setItem(`resume_${userId}`, JSON.stringify({
          id: resumeId,
          data: resumeData,
          template: selectedTemplate,
          updatedAt: new Date().toISOString()
        }))
      }

      toast.success('保存成功！')
      console.log('简历已保存:', {
        id: resumeId,
        title: resumeData.personalInfo.title,
        location: resumeData.personalInfo.location,
        skills: resumeData.skills?.length || 0
      })
    } catch (error) {
      console.error('保存失败:', error)
      toast.error('保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = async () => {
    const previewElement = document.getElementById('resume-preview')
    if (!previewElement) {
      toast.error('请先预览简历')
      return
    }

    try {
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        logging: false
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${resumeData.personalInfo.name || 'resume'}.pdf`)
      
      toast.success('PDF导出成功！')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('导出失败，请重试')
    }
  }

  const SelectedTemplate = TEMPLATES[selectedTemplate as keyof typeof TEMPLATES]?.component || StandardTemplate

  const panelButtons = [
    { id: 'preview', icon: Eye, title: '预览', color: 'blue' },
    { id: 'analyzer', icon: BarChart3, title: '分析', color: 'green' },
    { id: 'jobmatch', icon: Target, title: '匹配', color: 'purple' },
    { id: 'ai', icon: MessageSquare, title: 'AI助手', color: 'orange' }
  ]

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="h-16 bg-white border-b shadow-sm z-10">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">简历编辑器</h1>
            {resumeData.personalInfo.title && (
              <span className="text-sm text-gray-500">
                当前职位: {resumeData.personalInfo.title}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? '保存中...' : '保存'}
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              导出PDF
            </button>
          </div>
        </div>
      </header>

      {/* 主体内容 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧编辑器 */}
        <div className="w-1/2 bg-white border-r overflow-y-auto">
          <ResumeEditor />
        </div>

        {/* 右侧面板 */}
        <div className="w-1/2 flex flex-col bg-white">
          {/* 面板切换按钮 */}
          <div className="flex border-b">
            {panelButtons.map((btn) => {
              const Icon = btn.icon
              return (
                <button
                  key={btn.id}
                  onClick={() => setRightPanelContent(btn.id as any)}
                  className={`flex-1 flex items-center justify-center py-3 transition-colors ${
                    rightPanelContent === btn.id
                      ? `bg-${btn.color}-50 text-${btn.color}-600 border-b-2 border-${btn.color}-600`
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {btn.title}
                </button>
              )
            })}
          </div>

          {/* 面板内容 */}
          <div className="flex-1 overflow-y-auto p-6">
            {rightPanelContent === 'preview' && (
              <div id="resume-preview">
                <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin mx-auto" />}>
                  <SelectedTemplate data={resumeData} />
                </Suspense>
              </div>
            )}
            
            {rightPanelContent === 'analyzer' && (
              <ResumeAnalyzer resumeData={resumeData} />
            )}
            
            {rightPanelContent === 'jobmatch' && (
              <JobMatchAnalysis resumeData={resumeData} />
            )}
            
            {rightPanelContent === 'ai' && (
              <AIAssistant resumeData={resumeData} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorPage
