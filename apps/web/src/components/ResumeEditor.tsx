// apps/web/src/components/ResumeEditor.tsx
// 修复版本 - 添加必要的类型定义和导出

import { useState } from 'react'
import { Plus, Trash2, GripVertical, Save, Download } from 'lucide-react'
import { ExperienceEditor } from './ExperienceEditor'
import { EducationEditor } from './EducationEditor'
import { ProjectEditor } from './ProjectEditor'
import { SkillRecommender } from './SkillRecommender'
import { ExportModal } from './ExportModal'
import toast from 'react-hot-toast'
import { useResumeStore } from '../features/resume/state'

// 导出 ResumeData 类型
export interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    website?: string
    linkedin?: string
    github?: string
    summary?: string
  }
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certificates?: Certificate[]
  achievements?: Achievement[]
  languages?: Language[]
}

export interface Experience {
  id: string
  company: string
  position: string
  duration: string
  location?: string
  description: string
  achievements?: string[]
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  duration: string
  location?: string
  gpa?: string
  honors?: string[]
}

export interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: string
}

export interface Project {
  id: string
  name: string
  description: string
  duration: string
  technologies: string[]
  link?: string
  achievements?: string[]
}

export interface Certificate {
  id: string
  name: string
  issuer: string
  date: string
  link?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
}

export interface Language {
  id: string
  name: string
  proficiency: 'basic' | 'conversational' | 'professional' | 'native'
}

interface ResumeEditorProps {
  selectedTemplate: string
  onTemplateChange: (template: string) => void
}

export const ResumeEditor: React.FC<ResumeEditorProps> = () => {
  const { resumeData, updateResumeData } = useResumeStore()
  const [activeSection, setActiveSection] = useState<string>('personal')
  const [showExportModal, setShowExportModal] = useState(false)
  const [showSkillRecommender, setShowSkillRecommender] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 保存逻辑
      localStorage.setItem('resumeData', JSON.stringify(resumeData))
      toast.success('简历已保存')
    } catch (error) {
      toast.error('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      duration: '',
      description: '',
      achievements: []
    }
    updateResumeData({
      experience: [...resumeData.experience, newExperience]
    })
  }

  const updateExperience = (index: number, field: string, value: any) => {
    const updatedExperience = [...resumeData.experience]
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    }
    updateResumeData({ experience: updatedExperience })
  }

  const removeExperience = (index: number) => {
    const updatedExperience = resumeData.experience.filter((_, i: number) => i !== index)
    updateResumeData({ experience: updatedExperience })
  }

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      duration: '',
      honors: []
    }
    updateResumeData({
      education: [...resumeData.education, newEducation]
    })
  }

  const updateEducation = (index: number, field: string, value: any) => {
    const updatedEducation = [...resumeData.education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    }
    updateResumeData({ education: updatedEducation })
  }

  const removeEducation = (index: number) => {
    const updatedEducation = resumeData.education.filter((_, i: number) => i !== index)
    updateResumeData({ education: updatedEducation })
  }

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'intermediate',
      category: 'Technical'
    }
    updateResumeData({
      skills: [...resumeData.skills, newSkill]
    })
  }

  const updateSkill = (index: number, field: string, value: any) => {
    const updatedSkills = [...resumeData.skills]
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value
    }
    updateResumeData({ skills: updatedSkills })
  }

  const removeSkill = (index: number) => {
    const updatedSkills = resumeData.skills.filter((_, i: number) => i !== index)
    updateResumeData({ skills: updatedSkills })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* 顶部工具栏 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">简历编辑器</h2>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? '保存中...' : '保存'}
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            导出
          </button>
        </div>
      </div>

      {/* 分段导航 */}
      <div className="flex gap-2 mb-6 border-b">
        {['personal', 'experience', 'education', 'skills', 'projects'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeSection === section
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {section === 'personal' && '个人信息'}
            {section === 'experience' && '工作经历'}
            {section === 'education' && '教育背景'}
            {section === 'skills' && '专业技能'}
            {section === 'projects' && '项目经验'}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="space-y-6">
        {/* 个人信息 */}
        {activeSection === 'personal' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">个人信息</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="姓名"
                value={resumeData.personalInfo.name}
                onChange={(e) => updateResumeData({
                  personalInfo: { ...resumeData.personalInfo, name: e.target.value }
                })}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="邮箱"
                value={resumeData.personalInfo.email}
                onChange={(e) => updateResumeData({
                  personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                })}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="tel"
                placeholder="电话"
                value={resumeData.personalInfo.phone}
                onChange={(e) => updateResumeData({
                  personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                })}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="地址"
                value={resumeData.personalInfo.location}
                onChange={(e) => updateResumeData({
                  personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                })}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        )}

        {/* 工作经历 */}
        {activeSection === 'experience' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">工作经历</h3>
              <button
                onClick={addExperience}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                添加经历
              </button>
            </div>
            {resumeData.experience.map((exp: Experience, index: number) => (
              <ExperienceEditor
                key={exp.id}
                experience={exp}
                onChange={(field, value) => updateExperience(index, field, value)}
                onRemove={() => removeExperience(index)}
              />
            ))}
          </div>
        )}

        {/* 教育背景 */}
        {activeSection === 'education' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">教育背景</h3>
              <button
                onClick={addEducation}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                添加教育
              </button>
            </div>
            {resumeData.education.map((edu: Education, index: number) => (
              <EducationEditor
                key={edu.id}
                education={edu}
                onChange={(field, value) => updateEducation(index, field, value)}
                onRemove={() => removeEducation(index)}
              />
            ))}
          </div>
        )}

        {/* 专业技能 */}
        {activeSection === 'skills' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">专业技能</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSkillRecommender(true)}
                  className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  AI推荐
                </button>
                <button
                  onClick={addSkill}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  添加技能
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {resumeData.skills.map((skill: Skill, index: number) => (
                <div key={skill.id} className="flex items-center gap-2 p-3 border rounded-lg">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="技能名称"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 border rounded"
                  />
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(index, 'level', e.target.value)}
                    className="px-2 py-1 border rounded"
                  >
                    <option value="beginner">初级</option>
                    <option value="intermediate">中级</option>
                    <option value="advanced">高级</option>
                    <option value="expert">专家</option>
                  </select>
                  <button
                    onClick={() => removeSkill(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 项目经验 */}
        {activeSection === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">项目经验</h3>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1">
                <Plus className="h-4 w-4" />
                添加项目
              </button>
            </div>
            {resumeData.projects.map((project, index) => (
              <ProjectEditor
                key={project.id}
                project={project}
                onChange={(field, value) => {
                  const updated = [...resumeData.projects]
                  updated[index] = { ...updated[index], [field]: value }
                  updateResumeData({ projects: updated })
                }}
                onRemove={() => {
                  const updated = resumeData.projects.filter((_, i) => i !== index)
                  updateResumeData({ projects: updated })
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 导出模态框 */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          previewElement={document.querySelector('.resume-preview')}
        />
      )}

      {/* 技能推荐器 */}
      {showSkillRecommender && (
        <SkillRecommender
          currentSkills={resumeData.skills}
          onAddSkill={(skill) => {
            updateResumeData({
              skills: [...resumeData.skills, { ...skill, id: Date.now().toString() }]
            })
          }}
          onClose={() => setShowSkillRecommender(false)}
        />
      )}
    </div>
  )
}

export default ResumeEditor
