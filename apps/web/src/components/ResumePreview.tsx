import React from 'react'
import { ResumeData } from '@ai-resume-agent/ui-bridge'
import { Mail, Phone, MapPin, Calendar } from 'lucide-react'

interface ResumePreviewProps {
  data: ResumeData
  template: string
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template }) => {
  const getSkillLevel = (level: string) => {
    const levels = {
      beginner: '初级',
      intermediate: '中级',
      advanced: '高级',
      expert: '专家'
    }
    return levels[level as keyof typeof levels] || level
  }

  const getSkillLevelWidth = (level: string) => {
    const widths = {
      beginner: '25%',
      intermediate: '50%',
      advanced: '75%',
      expert: '100%'
    }
    return widths[level as keyof typeof widths] || '50%'
  }

  if (template === 'modern') {
    return (
      <div className="max-w-[210mm] mx-auto bg-white shadow-lg" style={{ minHeight: '297mm' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <h1 className="text-3xl font-bold mb-2">{data.personalInfo.name || '您的姓名'}</h1>
          <div className="flex flex-wrap gap-4 text-sm opacity-90">
            {data.personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{data.personalInfo.location}</span>
              </div>
            )}
          </div>
          {data.personalInfo.summary && (
            <p className="mt-4 text-sm leading-relaxed opacity-95">
              {data.personalInfo.summary}
            </p>
          )}
        </div>

        <div className="p-8 space-y-6">
          {/* Work Experience */}
          {data.experience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
                工作经历
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={exp.id || index} className="border-l-4 border-blue-200 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {exp.startDate} - {exp.endDate || '至今'}
                      </div>
                    </div>
                    {exp.description && (
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {exp.description.split('\n').map((line, i) => (
                          <p key={i} className="mb-1">{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
                教育背景
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={edu.id || index} className="border-l-4 border-green-200 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{edu.degree} - {edu.major}</h3>
                        <p className="text-green-600">{edu.school}</p>
                        {edu.gpa && (
                          <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {edu.startDate} - {edu.endDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
                专业技能
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.skills.map((skill, index) => (
                  <div key={skill.id || index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{skill.name}</span>
                      <span className="text-sm text-gray-600">{getSkillLevel(skill.level)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: getSkillLevelWidth(skill.level) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    )
  }

  // Standard Template (默认)
  return (
    <div className="max-w-[210mm] mx-auto bg-white shadow-lg" style={{ minHeight: '297mm' }}>
      <div className="p-8 space-y-6">
        {/* Header */}
        <header className="text-center border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {data.personalInfo.name || '您的姓名'}
          </h1>
          <div className="flex justify-center flex-wrap gap-6 text-sm text-gray-600">
            {data.personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{data.personalInfo.location}</span>
              </div>
            )}
          </div>
        </header>

        {/* Summary */}
        {data.personalInfo.summary && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3 uppercase tracking-wide">
              个人简介
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {data.personalInfo.summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {data.experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">
              工作经历
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      {exp.startDate} - {exp.endDate || '至今'}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-sm text-gray-700 ml-0 pl-0 leading-relaxed">
                      {exp.description.split('\n').map((line, i) => (
                        <p key={i} className="mb-1">{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">
              教育背景
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, index) => (
                <div key={edu.id || index}>
                  <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{edu.degree} - {edu.major}</h3>
                    <p className="text-gray-600">{edu.school}</p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">
              专业技能
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {data.skills.map((skill, index) => (
                <div key={skill.id || index} className="flex justify-between">
                  <span className="text-gray-700">{skill.name}</span>
                  <span className="text-sm text-gray-500">{getSkillLevel(skill.level)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">
              项目经历
            </h2>
            <div className="space-y-3">
              {data.projects.map((project, index) => (
                <div key={project.id || index}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-800">{project.name}</h3>
                    <span className="text-sm text-gray-500">{project.period}</span>
                  </div>
                  {project.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                  {project.technologies && (
                    <p className="text-sm text-gray-500 mt-1">
                      技术栈: {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
