import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Save, MessageCircle } from 'lucide-react'
import SimpleAIChat from '../components/SimpleAIChat'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function EditorPage() {
  const navigate = useNavigate()
  const [showAIChat, setShowAIChat] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    summary: '',
    experience: '',
    education: '',
    skills: ''
  })

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const element = document.getElementById('resume-preview')
      if (!element) return

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })

      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${resumeData.name || '简历'}.pdf`)
    } catch (error) {
      console.error('PDF导出失败:', error)
      alert('PDF导出失败，请重试')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 主编辑区 */}
      <div className="flex-1">
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold">简历编辑器</h1>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAIChat(!showAIChat)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                AI助手
              </button>
              <button 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isExporting ? '导出中...' : '导出PDF'}
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 gap-8">
          {/* 左侧编辑区 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">基本信息</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={resumeData.name}
                  onChange={(e) => setResumeData({...resumeData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="姓名"
                />
                <input
                  type="email"
                  value={resumeData.email}
                  onChange={(e) => setResumeData({...resumeData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="邮箱"
                />
                <input
                  type="tel"
                  value={resumeData.phone}
                  onChange={(e) => setResumeData({...resumeData, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="电话"
                />
                <input
                  type="text"
                  value={resumeData.title}
                  onChange={(e) => setResumeData({...resumeData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="目标职位"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">个人简介</h2>
              <textarea
                value={resumeData.summary}
                onChange={(e) => setResumeData({...resumeData, summary: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg h-32"
                placeholder="简要介绍你的背景和目标..."
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">工作经历</h2>
              <textarea
                value={resumeData.experience}
                onChange={(e) => setResumeData({...resumeData, experience: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg h-32"
                placeholder="描述你的工作经历..."
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">技能</h2>
              <textarea
                value={resumeData.skills}
                onChange={(e) => setResumeData({...resumeData, skills: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg h-24"
                placeholder="列出你的技能，用逗号分隔"
              />
            </div>
          </div>

          {/* 右侧预览区 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">实时预览</h2>
            <div id="resume-preview" className="border rounded p-8 bg-white">
              <h1 className="text-3xl font-bold mb-2">{resumeData.name || '你的名字'}</h1>
              <p className="text-gray-600 mb-4">{resumeData.title || '目标职位'}</p>
              
              <div className="text-sm text-gray-500 mb-6">
                <p>{resumeData.email || 'email@example.com'}</p>
                <p>{resumeData.phone || '138-0000-0000'}</p>
              </div>

              {resumeData.summary && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-blue-600">个人简介</h2>
                  <p className="text-gray-700">{resumeData.summary}</p>
                </div>
              )}

              {resumeData.experience && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-blue-600">工作经历</h2>
                  <p className="text-gray-700 whitespace-pre-line">{resumeData.experience}</p>
                </div>
              )}

              {resumeData.education && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-blue-600">教育背景</h2>
                  <p className="text-gray-700">{resumeData.education}</p>
                </div>
              )}

              {resumeData.skills && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-blue-600">技能</h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.split(',').map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI聊天侧边栏 */}
      {showAIChat && (
        <div className="w-96 border-l bg-white h-screen">
          <SimpleAIChat />
        </div>
      )}
    </div>
  )
}
