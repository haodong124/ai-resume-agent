// apps/web/src/components/ResumeAnalyzer.tsx
import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  TrendingUp,
  Target
} from 'lucide-react'
import { useResumeStore } from '../features/resume/state'

interface AnalysisResult {
  score: number
  completeness: {
    personalInfo: number
    experience: number
    education: number
    skills: number
    projects: number
  }
  suggestions: string[]
  strengths: string[]
  improvements: string[]
}

export const ResumeAnalyzer: React.FC = () => {
  const { resumeData } = useResumeStore()
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)

  const analyzeResume = () => {
    setLoading(true)
    
    // 模拟分析逻辑
    setTimeout(() => {
      const result: AnalysisResult = {
        score: calculateOverallScore(),
        completeness: {
          personalInfo: calculatePersonalInfoScore(),
          experience: calculateExperienceScore(),
          education: calculateEducationScore(),
          skills: calculateSkillsScore(),
          projects: calculateProjectsScore()
        },
        suggestions: generateSuggestions(),
        strengths: identifyStrengths(),
        improvements: identifyImprovements()
      }
      
      setAnalysis(result)
      setLoading(false)
    }, 2000)
  }

  const calculateOverallScore = (): number => {
    let score = 0
    const { personalInfo, experience, education, skills, projects } = resumeData

    // 个人信息 (25分)
    if (personalInfo.name) score += 5
    if (personalInfo.email) score += 5
    if (personalInfo.phone) score += 5
    if (personalInfo.location) score += 5
    if (personalInfo.summary) score += 5

    // 工作经历 (30分)
    if (experience.length > 0) score += 15
    if (experience.length >= 2) score += 10
    if (experience.some(exp => exp.description && exp.description.length > 100)) score += 5

    // 教育背景 (20分)
    if (education.length > 0) score += 20

    // 技能 (15分)
    if (skills.length >= 3) score += 10
    if (skills.length >= 6) score += 5

    // 项目经验 (10分)
    if (projects.length > 0) score += 5
    if (projects.length >= 2) score += 5

    return Math.min(score, 100)
  }

  const calculatePersonalInfoScore = (): number => {
    const { personalInfo } = resumeData
    let score = 0
    if (personalInfo.name) score += 20
    if (personalInfo.email) score += 20
    if (personalInfo.phone) score += 20
    if (personalInfo.location) score += 20
    if (personalInfo.summary) score += 20
    return score
  }

  const calculateExperienceScore = (): number => {
    const { experience } = resumeData
    if (experience.length === 0) return 0
    
    let score = 50 // 基础分
    if (experience.length >= 2) score += 25
    if (experience.some(exp => exp.description && exp.description.length > 100)) score += 25
    return score
  }

  const calculateEducationScore = (): number => {
    return resumeData.education.length > 0 ? 100 : 0
  }

  const calculateSkillsScore = (): number => {
    const skillCount = resumeData.skills.length
    if (skillCount === 0) return 0
    if (skillCount < 3) return 40
    if (skillCount < 6) return 70
    return 100
  }

  const calculateProjectsScore = (): number => {
    const projectCount = resumeData.projects.length
    if (projectCount === 0) return 0
    if (projectCount === 1) return 60
    return 100
  }

  const generateSuggestions = (): string[] => {
    const suggestions = []
    const { personalInfo, experience, skills, projects } = resumeData

    if (!personalInfo.summary) {
      suggestions.push('添加个人简介，突出您的核心优势')
    }
    if (experience.length === 0) {
      suggestions.push('添加工作经历，即使是实习或兼职经验')
    }
    if (skills.length < 5) {
      suggestions.push('完善技能列表，至少添加5个核心技能')
    }
    if (projects.length === 0) {
      suggestions.push('添加项目经验展示您的实践能力')
    }
    if (experience.some(exp => exp.description.length < 50)) {
      suggestions.push('丰富工作经历描述，使用STAR法则')
    }

    return suggestions
  }

  const identifyStrengths = (): string[] => {
    const strengths = []
    const { personalInfo, experience, education, skills } = resumeData

    if (personalInfo.summary && personalInfo.summary.length > 50) {
      strengths.push('个人简介详细且专业')
    }
    if (experience.length >= 2) {
      strengths.push('工作经验丰富')
    }
    if (skills.length >= 6) {
      strengths.push('技能覆盖面广')
    }
    if (education.some(edu => edu.gpa)) {
      strengths.push('学术成绩优秀')
    }

    return strengths
  }

  const identifyImprovements = (): string[] => {
    const improvements = []
    const { experience, projects } = resumeData

    if (experience.some(exp => !exp.achievements || exp.achievements.length === 0)) {
      improvements.push('添加具体的工作成就和数据')
    }
    if (projects.length > 0 && projects.some(proj => !proj.link)) {
      improvements.push('为项目添加链接或GitHub地址')
    }
    if (experience.some(exp => exp.description.length < 100)) {
      improvements.push('扩展工作描述，使用更多量化指标')
    }

    return improvements
  }

  useEffect(() => {
    if (resumeData.personalInfo.name) {
      analyzeResume()
    }
  }, [resumeData])

  if (!analysis && !loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">简历分析</h3>
        <p className="text-gray-600 mb-4">完善简历信息后即可获得专业分析</p>
        <button
          onClick={analyzeResume}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          立即分析
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">AI正在分析您的简历...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 总体得分 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className={`text-5xl font-bold mb-2 ${
            analysis!.score >= 80 ? 'text-green-600' :
            analysis!.score >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {analysis!.score}
          </div>
          <div className="text-gray-600">简历完整度评分</div>
        </div>

        {/* 分项得分 */}
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(analysis!.completeness).map(([section, score]) => (
            <div key={section} className="text-center">
              <div className={`text-2xl font-bold mb-1 ${
                score >= 80 ? 'text-green-600' :
                score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {score}
              </div>
              <div className="text-xs text-gray-600">
                {section === 'personalInfo' ? '个人信息' :
                 section === 'experience' ? '工作经历' :
                 section === 'education' ? '教育背景' :
                 section === 'skills' ? '专业技能' : '项目经验'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 优势和建议 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 优势 */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-900">简历优势</h4>
          </div>
          <ul className="space-y-2">
            {analysis!.strengths.map((strength, index) => (
              <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* 改进建议 */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-orange-900">改进建议</h4>
          </div>
          <ul className="space-y-2">
            {analysis!.improvements.map((improvement, index) => (
              <li key={index} className="text-sm text-orange-800 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 具体建议 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-gray-900">优化建议</h4>
        </div>
        <div className="space-y-3">
          {analysis!.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{suggestion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ResumeAnalyzer
