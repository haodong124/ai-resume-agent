import { useState } from 'react'
import { 
  X, 
  Download, 
  FileText, 
  Image, 
  Share2, 
  Lock,
  Users,
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

    if (!exportPermission.canExport) {
      toast('请完成验证后继续导出')
      return
    }

    setIsExporting(true)
    try {
      if (format === 'pdf') {
        const exporter = new PDFExporter()
        await PDFExporter.exportToPDF(previewElement, { filename: resumeData.personalInfo.name })
        toast.success('PDF 导出成功！')
      } else if (format === 'png') {
        const exporter = new PDFExporter()
        await PDFExporter.exportToImage(previewElement, 'png')
        toast.success('图片导出成功！')
      } else if (format === 'docx') {
        toast('Word 导出功能即将推出')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('导出失败，请重试')
    } finally {
      setIsExporting(false)
    }
  }

  const handleCreateShareLink = async () => {
    setIsCreatingShare(true)
    try {
      const result = await createShareLink('current-resume-id', true)
      if (result.success) {
        setShareUrl(result.url)
        toast.success('分享链接已创建')
      }
    } catch (error) {
      toast.error('创建分享链接失败')
    } finally {
      setIsCreatingShare(false)
    }
  }

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopiedShare(true)
    setTimeout(() => setCopiedShare(false), 2000)
    toast.success('链接已复制到剪贴板')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">导出简历</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 导出格式选择 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">选择导出格式</h3>
            <div className="grid gap-3">
              {exportFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => handleExport(format.id)}
                  disabled={isExporting || format.premium}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    format.premium
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:shadow-md hover:scale-[1.02]'
                  } ${format.color}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <format.icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{format.name}</div>
                        <div className="text-sm opacity-80">{format.description}</div>
                      </div>
                    </div>
                    {format.premium && (
                      <Lock className="h-4 w-4 opacity-60" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 分享链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">在线分享</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              {!shareUrl ? (
                <button
                  onClick={handleCreateShareLink}
                  disabled={isCreatingShare}
                  className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  {isCreatingShare ? '创建中...' : '创建分享链接'}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border rounded-lg bg-white"
                    />
                    <button
                      onClick={handleCopyShareLink}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors flex items-center gap-2"
                    >
                      {copiedShare ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copiedShare ? '已复制' : '复制'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>任何人都可以通过此链接查看您的简历</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 打印选项 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">打印简历</h3>
            <button
              onClick={() => {
                if (previewElement) {
                  const helper = new PrintHelper()
                  PrintHelper.print(previewElement)
                }
              }}
              className="w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              打印预览
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
