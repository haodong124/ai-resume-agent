// apps/web/src/components/ResumeEditor.tsx
import React, { useState } from 'react'
import { Plus, Trash2, Save, User, Briefcase, GraduationCap, Award, Code } from 'lucide-react'
import toast from 'react-hot-toast'
import { useResumeStore } from '../features/resume/state'
// 使用统一的类型定义，删除本地重复定义
import type { ResumeData, Experience, Education, Skill, Project } from '../types/resume'

export const ResumeEditor: React.FC = () => {
  const { 
    resumeData, 
    updatePersonalInfo,
    addExperience,
    updateExperience, 
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addProject,
    updateProject,
    removeProject,
    addSkill,
    updateSkill,
    removeSkill
  } = useResumeStore()
  
  const [activeSection, setActiveSection] = useState<string>('personal')
  const [isSaving, setIsSaving] = useState(false)

  // 其余代码保持不变...
  const handleSave = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem('resumeData', JSON.stringify(resumeData))
      toast.success('简历已保存')
    } catch (error) {
      toast.error('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const sections = [
    { id: 'personal', name: '个人信息', icon: User },
    { id: 'experience', name: '工作经历', icon: Briefcase },
    { id: 'education', name: '教育背景', icon: GraduationCap },
    { id: 'skills', name: '专业技能', icon: Code },
    { id: 'projects', name: '项目经验', icon: Award },
  ]

  return (
    <div className="h-full flex">
      {/* 左侧导航 */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">编辑简历</h2>
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {section.name}
                </button>
              )
            })}
          </nav>
          
          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>

      {/* 右侧编辑区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* 个人信息 */}
          {activeSection === 'personal' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">个人信息</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">姓名 *</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.name || ''}
                    onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="请输入您的姓名"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">职位目标</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.title || ''}
                    onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="如：前端开发工程师"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">邮箱 *</label>
                  <input
                    type="email"
                    value={resumeData.personalInfo.email || ''}
                    onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">电话 *</label>
                  <input
                    type="tel"
                    value={resumeData.personalInfo.phone || ''}
                    onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="138xxxx8888"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">所在城市</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.location || ''}
                    onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="如：北京"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">个人网站</label>
                  <input
                    type="url"
                    value={resumeData.personalInfo.website || ''}
                    onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">个人简介</label>
                <textarea
                  value={resumeData.personalInfo.summary || ''}
                  onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="用2-3句话简洁地介绍自己的专业背景和核心优势..."
                />
              </div>
            </div>
          )}

          {/* 工作经历部分 */}
          {activeSection === 'experience' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">工作经历</h3>
                <button
                  onClick={addExperience}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加经历
                </button>
              </div>
              
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-medium">工作经历 {index + 1}</h4>
                    <button
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">公司名称 *</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="公司名称"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">职位 *</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="职位名称"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">工作时间 *</label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="2022.01 - 2024.01"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">工作地点</label>
                      <input
                        type="text"
                        value={exp.location || ''}
                        onChange={(e) => updateExperience(index, 'location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="北京"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">工作描述 *</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={4}
                      placeholder="详细描述您在这个职位上的主要工作内容、职责和取得的成果..."
                    />
                  </div>
                </div>
              ))}
              
              {resumeData.experience.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>暂无工作经历，点击上方按钮添加</p>
                </div>
              )}
            </div>
          )}

          {/* 教育背景部分 */}
          {activeSection === 'education' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">教育背景</h3>
                <button
                  onClick={addEducation}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加教育
                </button>
              </div>
              
              {resumeData.education.map((edu, index) => (
                <div key={edu.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-medium">教育经历 {index + 1}</h4>
                    <button
                      onClick={() => removeEducation(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">学校名称 *</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="学校名称"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">学历 *</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="如：本科"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">专业 *</label>
                      <input
                        type="text"
                        value={edu.major}
                        onChange={(e) => updateEducation(index, 'major', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="专业名称"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">就读时间 *</label>
                      <input
                        type="text"
                        value={edu.duration}
                        onChange={(e) => updateEducation(index, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="2018.09 - 2022.06"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">GPA</label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="如：3.8/4.0"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {resumeData.education.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>暂无教育背景，点击上方按钮添加</p>
                </div>
              )}
            </div>
          )}

          {/* 项目经验部分 */}
          {activeSection === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">项目经验</h3>
                <button
                  onClick={addProject}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加项目
                </button>
              </div>
              
              {resumeData.projects.map((project, index) => (
                <div key={project.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-medium">项目 {index + 1}</h4>
                    <button
                      onClick={() => removeProject(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">项目名称 *</label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="项目名称"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">项目时间</label>
                      <input
                        type="text"
                        value={project.duration}
                        onChange={(e) => updateProject(index, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="2023.01 - 2023.06"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">技术栈</label>
                    <input
                      type="text"
                      value={Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                      onChange={(e) => updateProject(index, 'technologies', e.target.value.split(', ').filter(t => t.trim()))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">项目链接</label>
                    <input
                      type="url"
                      value={project.link || ''}
                      onChange={(e) => updateProject(index, 'link', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="https://github.com/yourusername/project"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">项目描述 *</label>
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={4}
                      placeholder="详细描述项目背景、您的贡献和取得的成果..."
                    />
                  </div>
                </div>
              ))}
              
              {resumeData.projects.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>暂无项目经验，点击上方按钮添加</p>
                </div>
              )}
            </div>
          )}

          {/* 专业技能部分 */}
          {activeSection === 'skills' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">专业技能</h3>
                <button
                  onClick={() => addSkill({ name: '', level: 'intermediate', category: '技术技能' })}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加技能
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeData.skills.map((skill, index) => (
                  <div key={skill.id || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">技能 {index + 1}</h4>
                      <button
                        onClick={() => removeSkill(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">技能名称 *</label>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkill(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="如：JavaScript"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">熟练程度</label>
                        <select
                          value={skill.level}
                          onChange={(e) => updateSkill(index, 'level', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="beginner">初级</option>
                          <option value="intermediate">中级</option>
                          <option value="advanced">高级</option>
                          <option value="expert">专家</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">技能分类</label>
                        <select
                          value={skill.category}
                          onChange={(e) => updateSkill(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="技术技能">技术技能</option>
                          <option value="编程语言">编程语言</option>
                          <option value="框架工具">框架工具</option>
                          <option value="软技能">软技能</option>
                          <option value="语言能力">语言能力</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {resumeData.skills.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Code className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>暂无专业技能，点击上方按钮添加</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeEditor
