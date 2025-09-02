// apps/web/src/pages/EditorPage.tsx (最终完整版)
import React, { useState, useEffect, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Save, Download, Eye, EyeOff, Sparkles, 
  ChevronDown, Loader2, BarChart3, Target
} from 'lucide-react'
import { useResumeStore } from '../features/resume/state'
import ResumeEditor from '../components/ResumeEditor'
import ResumeAnalyzer from '../components/ResumeAnalyzer'
import JobMatchAnalysis from '../components/JobMatchAnalysis'
import toast from 'react-hot-toast'

// 动态导入模板
const StandardTemplate = lazy(() => import('../components/templates/StandardTemplate'))
const AmericanBusinessTemplate = lazy(() => import('../components/templates/AmericanBusinessTemplate'))

const TEMPLATES = {
  standard: { name: '标准模板', component: StandardTemplate },
  american: { name: '美式商务', component: AmericanBusinessTemplate },
}

const EditorPage: React.FC = () => {
  const navigate = useNavigate()
  const { resumeData, selectedTemplate, setTemplate } = useResumeStore()
  const [showPreview, setShowPreview] = useState(true)
  const [showAnalyzer, setShowAnalyzer] = useState(false)
  const [showJobMatch, setShowJobMatch] = useState(false)
  const [rightPanelContent, setRightPanelContent] = useState<'preview' | 'analyzer' | 'jobmatch'>('preview')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem('resumeData', JSON.stringify(resumeData))
      localStorage.setItem('selectedTemplate', selectedTemplate)
      toast.success('保存成功！')
    } catch (error) {
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
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      
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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="h-16 bg-white border-b shadow-sm z-10">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">简历编辑器</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* 模板选择 */}
            <div className="relative">
              <select
                value={selectedTemplate}
                onChange={(e) => setTemplate(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 bg-gray-50 border rounded-lg cursor-pointer hover:bg-gray-100 transition text-sm"
              >
                {Object.entries(TEMPLATES).map(([key, template]) => (
                  <option key={key} value={key}>
                    {template.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* 右侧面板切换 */}
            <button
              onClick={() => setRightPanelContent('preview')}
              className={`p-2 rounded-lg transition ${
                rightPanelContent === 'preview' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
              title="预览"
            >
              <Eye className="w-5 h-5" />
            </button>

            <button
              onClick={() => setRightPanelContent('analyzer')}
              className={`p-2 rounded-lg transition ${
                rightPanelContent === 'analyzer' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'
              }`}
              title="简历分析"
            >
              <BarChart3 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setRightPanelContent('jobmatch')}
              className={`p-2 rounded-lg transition ${
                rightPanelContent === 'jobmatch' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
              }`}
              title="职位匹配"
            >
              <Target className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-gray-300" />

            {/* 操作按钮 */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" />
              {isSaving ? '保存中...' : '保存'}
            </button>

            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              导出PDF
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 编辑器 */}
        <div className="w-1/2 border-r border-gray-200">
          <ResumeEditor />
        </div>

        {/* 右侧面板 */}
        <div className="w-1/2 bg-white overflow-y-auto">
          <div className="p-6">
            {rightPanelContent === 'preview' && (
              <>
                <div className="mb-4 text-center">
                  <h2 className="text-lg font-semibold text-gray-700">简历预览</h2>
                </div>
                
                <div id="resume-preview" className="bg-white">
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-64">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  }>
                    <SelectedTemplate resumeData={resumeData} isPreview={true} />
                  </Suspense>
                </div>
              </>
            )}

            {rightPanelContent === 'analyzer' && (
              <>
                <div className="mb-4 text-center">
                  <h2 className="text-lg font-semibold text-gray-700">简历分析</h2>
                </div>
                <ResumeAnalyzer />
              </>
            )}

            {rightPanelContent === 'jobmatch' && (
              <>
                <div className="mb-4 text-center">
                  <h2 className="text-lg font-semibold text-gray-700">职位匹配分析</h2>
                </div>
                <JobMatchAnalysis />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorPage
