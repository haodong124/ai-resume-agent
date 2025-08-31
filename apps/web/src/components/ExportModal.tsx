import React, { useState, useRef } from 'react'
import { 
  X, 
  Download, 
  FileText, 
  Image, 
  Share2, 
  Lock,
  Unlock,
  Users,
  Eye,
  Copy,
  Check
} from 'lucide-react'
import { PDFExporter, PrintHelper } from '../lib/pdf'
import { useResumeStore } from '../features/resume/state'
import { createShareLink, checkExportPermission } from '../lib/supabase'
import toast from 'react-hot-toast'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  previewElement: HTMLElement | null
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  previewElement,
}) => {
  const { resumeData } = useResumeStore()
  const [isExporting, setIsExporting] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [isCreatingShare, setIsCreatingShare] = useState(false)
  const [exportPermission, setExportPermission] = useState({ 
    canExport: true, 
    currentClicks: 0, 
    requiredClicks: 3 
  })
  const [copiedShare, setCopiedShare] = useState(false)

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF 文件',
      description: '最常用的简历格式，适合投递',
      icon: FileText,
      color: 'bg-red-50 text-red-600 border-red-200',
      premium: false,
    },
    {
      id: 'png',
      name: 'PNG 图片',
      description: '图片格式，适合预览分享',
      icon: Image,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      premium: false,
    },
    {
      id: 'docx',
      name: 'Word 文档',
      description: '可编辑格式，便于进一步修改',
      icon: FileText,
      color: 'bg-green-50 text-green-600 border-green-200',
      premium: true,
    },
  ]

  React.useEffect(() => {
    if (isOpen) {
      checkPermissions()
    }
  }, [isOpen])

  const checkPermissions = async () => {
    try {
      const permission = await checkExportPermission('current-resume-id')
      setExportPermission(permission)
    } catch (error) {
      console.error('Check permissions error:', error)
    }
  }

  const handleExport = async (format: string) => {
    if (!previewElement) {
      toast.error('预览元素未找到，请刷新页面重试')
      return
    }

    if (!exportPermission.canExport && format === 'pdf') {
      toast.error(`需要分享链接被点击 ${exportPermission.requiredClicks} 次才能导出PDF`)
      return
    }

    setIsExporting(true)
    try {
      const filename = `${resumeData.personalInfo.name || 'Resume'}_${new Date().toISOString().split('T')[0]}`
      
      switch (format) {
        case 'pdf':
          await PDFExporter.exportToPDF(previewElement, {
            filename: `${filename}.pdf`,
            scale: 3,
            format: 'a4',
            orientation: 'portrait',
          })
          break
        
        case 'png':
          await PDFExporter.exportToImage(previewElement, 'png', 0.95)
          break
        
        case 'docx':
          // TODO: Implement DOCX export
          toast.info('Word导出功能即将上线')
          break
        
        default:
          throw new Error('不支持的导出格式')
      }
      
      toast.success(`${format.toUpperCase()} 导出成功！`)
      onClose()
    } catch (error) {
      console.error('Export error:', error)
      toast.error('导出失败，请重试')
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrint = () => {
    if (!previewElement) {
      toast.error('预览元素未找到')
      return
    }
    PrintHelper.print(previewElement)
  }

  const handleCreateShareLink = async () => {
    setIsCreatingShare(true)
    try {
      const url = await createShareLink('current-resume-id')
      if (url) {
        setShareUrl(url)
        toast.success('分享链接创建成功！')
      } else {
        throw new Error('创建分享链接失败')
      }
    } catch (error) {
      toast.error('创建分享链接失败')
      } finally {
      setIsCreatingShare(false)
    }
  }

  const copyShareUrl = async () => {
    if (!shareUrl) return
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiedShare(true)
      toast.success('链接已复制到剪贴板')
      setTimeout(() => setCopiedShare(false), 2000)
    } catch (error) {
      toast.error('复制失败，请手动复制')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">导出简历</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Export Permission Status */}
            {!exportPermission.canExport && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800 mb-1">解锁PDF导出</h3>
                    <p className="text-sm text-yellow-700 mb-2">
                      您的分享链接需要被点击 {exportPermission.requiredClicks} 次才能解锁PDF导出功能
                    </p>
                    <p className="text-sm text-yellow-600">
                      当前: {exportPermission.currentClicks}/{exportPermission.requiredClicks} 次点击
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Export Formats */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">选择导出格式</h3>
              <div className="grid grid-cols-1 gap-3">
                {exportFormats.map((format) => {
                  const Icon = format.icon
                  const isLocked = !exportPermission.canExport && format.id === 'pdf'
                  const isPremium = format.premium
                  
                  return (
                    <button
                      key={format.id}
                      onClick={() => handleExport(format.id)}
                      disabled={isExporting || isLocked || isPremium}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${format.color}`}
                    >
                      <div className="relative">
                        <Icon className="w-8 h-8" />
                        {isLocked && <Lock className="w-4 h-4 absolute -top-1 -right-1 text-yellow-600" />}
                        {isPremium && <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs px-1 rounded">PRO</span>}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{format.name}</h4>
                        <p className="text-sm opacity-75">{format.description}</p>
                        {isLocked && (
                          <p className="text-xs text-yellow-600 mt-1">需要解锁</p>
                        )}
                        {isPremium && (
                          <p className="text-xs text-purple-600 mt-1">升级到专业版</p>
                        )}
                      </div>
                      <Download className="w-5 h-5" />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">快捷操作</h3>
              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  打印简历
                </button>
              </div>
            </div>

            {/* Share Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">分享简历</h3>
              
              {!shareUrl ? (
                <button
                  onClick={handleCreateShareLink}
                  disabled={isCreatingShare}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Share2 className="w-4 h-4" />
                  {isCreatingShare ? '创建中...' : '创建分享链接'}
                </button>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Share2 className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">分享链接已创建</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded text-sm"
                    />
                    <button
                      onClick={copyShareUrl}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                    >
                      {copiedShare ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedShare ? '已复制' : '复制'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-sm text-blue-700">
                    <Users className="w-4 h-4" />
                    <span>分享链接7天内有效，被访问后可解锁PDF导出</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Loading Overlay */}
          {isExporting && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-gray-600">正在导出，请稍候...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
