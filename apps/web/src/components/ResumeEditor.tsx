import React, { useState, useRef } from 'react'
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Award, 
  Languages,
  Plus,
  Trash2,
  Eye,
  Settings
} from 'lucide-react'
import { ResumeData } from '@ai-resume-agent/ui-bridge'
import { ResumePreview } from './ResumePreview'
import { TemplateSelector } from './TemplateSelector'

interface ResumeEditorProps {
  resumeData: ResumeData
  setResumeData: (data: Partial<ResumeData>) => void
  selectedTemplate: string
  onTemplateChange: (template: string) => void
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resumeData,
  setResumeData,
  selectedTemplate,
  onTemplateChange,
}) => {
  const [activeSection, setActiveSection] = useState('personal')
  const [showPreview, setShowPreview] = useState(true)
  const previewRef = useRef<HTMLDivElement>(null)

  const sections = [
    { id: 'personal', label: '个人信息', icon: User },
    { id: 'experience', label: '工作经历', icon: Briefcase },
    { id: 'education', label: '教育背景', icon: GraduationCap },
    { id: 'skills', label: '技能', icon: Code },
    { id: 'projects', label: '项目经历', icon: Award },
    { id: 'languages', label: '语言能力', icon: Languages },
  ]

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData({
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    })
  }

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    }
    setResumeData({
      experience: [...resumeData.experience, newExp],
    })
  }

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...resumeData.experience]
    updated[index] = { ...updated[index], [field]: value }
    setResumeData({ experience: updated })
  }

  const removeExperience = (index: number) => {
    const updated = resumeData.experience.filter((_, i) => i !== index)
    setResumeData({ experience: updated })
  }

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      gpa: '',
    }
    setResumeData({
      education: [...resumeData.education, newEdu],
    })
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...resumeData.education]
    updated[index] = { ...updated[index], [field]: value }
    setResumeData({ education: updated })
  }

  const removeEducation = (index: number) => {
    const updated = resumeData.education.filter((_, i) => i !== index)
    setResumeData({ education: updated })
  }

  const addSkill = () => {
    const newSkill = {
      id: Date.now().toString(),
      name: '',
      level: 'intermediate' as const,
      category: 'technical' as const,
    }
    setResumeData({
      skills: [...resumeData.skills, newSkill],
    })
  }

  const updateSkill = (index: number, field: string, value: any) => {
    const updated = [...resumeData.skills]
    updated[index] = { ...updated[index], [field]: value }
    setResumeData({ skills: updated })
  }

  const removeSkill = (index: number) => {
    const updated = resumeData.skills.filter((_, i) => i !== index)
    setResumeData({ skills: updated })
  }

  const renderPersonalSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">个人信息</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">姓名</label>
          <input
            type="text"
            value={resumeData.personalInfo.name || ''}
            onChange={(e) => updatePersonalInfo('name', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="请输入您的姓名"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">邮箱</label>
          <input
            type="email"
            value={resumeData.personalInfo.email || ''}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="example@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">电话</label>
          <input
            type="tel"
            value={resumeData.personalInfo.phone || ''}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="请输入手机号码"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">所在地</label>
          <input
            type="text"
            value={resumeData.personalInfo.location || ''}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="城市"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">个人简介</label>
        <textarea
          value={resumeData.personalInfo.summary || ''}
          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="简要描述您的职业背景和优势..."
        />
      </div>
    </div>
  )

  const renderExperienceSection = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">工作经历</h3>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          添加经历
        </button>
      </div>
      
      {resumeData.experience.map((exp, index) => (
        <div key={exp.id || index} className="p-4 border rounded-lg space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">工作经历 {index + 1}</h4>
            <button
              onClick={() => removeExperience(index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={exp.company || ''}
              onChange={(e) => updateExperience(index, 'company', e.target.value)}
              placeholder="公司名称"
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={exp.position || ''}
              onChange={(e) => updateExperience(index, 'position', e.target.value)}
              placeholder="职位名称"
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={exp.startDate || ''}
              onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
              placeholder="开始时间 (如: 2022年1月)"
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={exp.endDate || ''}
              onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
              placeholder="结束时间 (如: 2023年12月)"
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={exp.current}
            />
          </div>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={exp.current || false}
              onChange={(e) => {
                updateExperience(index, 'current', e.target.checked)
                if (e.target.checked) {
                  updateExperience(index, 'endDate', '至今')
                }
              }}
              className="rounded"
            />
            <span className="text-sm">目前在职</span>
          </label>
          
          <textarea
            value={exp.description || ''}
            onChange={(e) => updateExperience(index, 'description', e.target.value)}
            placeholder="工作职责和成就（建议使用量化的成果描述）"
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
    </div>
  )

  const renderEducationSection = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">教育背景</h3>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          添加教育
        </button>
      </div>
      
      {resumeData.education.map((edu, index) => (
        <div key={edu.id || index} className="p-4 border rounded-lg space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">教育经历 {index + 1}</h4>
            <button
              onClick={() => removeEducation(index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={edu.school || ''}
              onChange={(e) => updateEducation(index, 'school', e.target.value)}
              placeholder="学校名称"
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={edu.degree || ''}
              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              placeholder="学历 (如: 本科)"
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={edu.major || ''}
              onChange={(e) => updateEducation(index, 'major', e.target.value)}
              placeholder="专业"
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={edu.gpa || ''}
              onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
              placeholder="GPA (可选)"
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={edu.startDate || ''}
              onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
              placeholder="入学时间"
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={edu.endDate || ''}
              onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
              placeholder="毕业时间"
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ))}
    </div>
  )

  const renderSkillsSection = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">技能</h3>
        <button
          onClick={addSkill}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          添加技能
        </button>
      </div>
      
      {resumeData.skills.map((skill, index) => (
        <div key={skill.id || index} className="p-4 border rounded-lg space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">技能 {index + 1}</h4>
            <button
              onClick={() => removeSkill(index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={skill.name || ''}
              onChange={(e) => updateSkill(index, 'name', e.target.value)}
              placeholder="技能名称"
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={skill.level || 'intermediate'}
              onChange={(e) => updateSkill(index, 'level', e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">初级</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
              <option value="expert">专家</option>
            </select>
            <select
              value={skill.category || 'technical'}
              onChange={(e) => updateSkill(index, 'category', e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="technical">技术技能</option>
              <option value="soft">软技能</option>
              <option value="language">语言</option>
              <option value="tool">工具</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  )

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalSection()
      case 'experience':
        return renderExperienceSection()
      case 'education':
        return renderEducationSection()
      case 'skills':
        return renderSkillsSection()
      default:
        return renderPersonalSection()
    }
  }

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Section Navigation */}
      <div className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">编辑区域</h2>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <TemplateSelector
            selected={selectedTemplate}
            onChange={onTemplateChange}
          />
        </div>
        
        <nav className="p-2">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{section.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex">
        {/* Form Section */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {renderActiveSection()}
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="w-[500px] border-l bg-gray-50 overflow-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">预览</h3>
                <button className="p-2 hover:bg-gray-200 rounded-lg">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              <div ref={previewRef} className="bg-white">
                <ResumePreview
                  data={resumeData}
                  template={selectedTemplate}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
