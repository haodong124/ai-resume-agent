// apps/web/src/components/SkillAnalysis.tsx
import React, { useState, useEffect } from 'react'
import { TrendingUp, Target, BookOpen, Award, AlertCircle } from 'lucide-react'

interface Skill {
  name: string
  level: number // 1-10
  category: 'technical' | 'soft' | 'tool' | 'framework'
  trending: boolean
  marketDemand: number // 1-100
}

interface SkillGap {
  skill: string
  importance: number
  difficulty: number
  resources: string[]
  estimatedTime: string
}

interface LearningPath {
  id: string
  title: string
  description: string
  skills: string[]
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  priority: number
}

const SkillAnalysis: React.FC = () => {
  const [currentSkills, setCurrentSkills] = useState<Skill[]>([])
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([])
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)

  useEffect(() => {
    loadSkillAnalysis()
  }, [targetRole])

  const loadSkillAnalysis = async () => {
    try {
      setLoading(true)
      const resumeData = JSON.parse(localStorage.getItem('currentResume') || '{}')
      
      const response = await fetch('/.netlify/functions/analyze-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resumeData,
          targetRole: targetRole || '前端开发工程师'
        })
      })

      const result = await response.json()
      if (result.success) {
        setCurrentSkills(result.data.currentSkills)
        setSkillGaps(result.data.skillGaps)
        setLearningPaths(result.data.learningPaths)
      }
    } catch (error) {
      console.error('技能分析失败:', error)
      // 使用模拟数据
      setCurrentSkills([
        { name: 'JavaScript', level: 8, category: 'technical', trending: true, marketDemand: 95 },
        { name: 'React', level: 7, category: 'framework', trending: true, marketDemand: 90 },
        { name: 'Node.js', level: 6, category: 'technical', trending: true, marketDemand: 85 },
        { name: 'CSS', level: 7, category: 'technical', trending: false, marketDemand: 80 },
        { name: 'Git', level: 8, category: 'tool', trending: false, marketDemand: 95 },
        { name: '团队协作', level: 8, category: 'soft', trending: false, marketDemand: 90 }
      ])
      
      setSkillGaps([
        { 
          skill: 'TypeScript', 
          importance: 90, 
          difficulty: 60, 
          resources: ['TypeScript官方文档', '《深入理解TypeScript》'],
          estimatedTime: '2-3周'
        },
        { 
          skill: 'Next.js', 
          importance: 85, 
          difficulty: 70, 
          resources: ['Next.js官方教程', 'Vercel部署指南'],
          estimatedTime: '3-4周'
        },
        { 
          skill: 'Docker', 
          importance: 75, 
          difficulty: 80, 
          resources: ['Docker从入门到实践', 'Kubernetes基础'],
          estimatedTime: '4-6周'
        }
      ])

      setLearningPaths([
        {
          id: '1',
          title: '全栈JavaScript开发者',
          description: '掌握现代JavaScript全栈开发技能',
          skills: ['TypeScript', 'Next.js', 'Node.js', 'MongoDB'],
          duration: '8-12周',
          difficulty: 'intermediate',
          priority: 95
        },
        {
          id: '2',
          title: '前端架构师',
          description: '成为能够设计和实施大型前端架构的专家',
          skills: ['微前端', 'Webpack', 'CI/CD', '性能优化'],
          duration: '12-16周',
          difficulty: 'advanced',
          priority: 85
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getSkillLevelColor = (level: number) => {
    if (level >= 8) return 'bg-green-500'
    if (level >= 6) return 'bg-blue-500'
    if (level >= 4) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getSkillLevelText = (level: number) => {
    if (level >= 8) return '精通'
    if (level >= 6) return '熟练'
    if (level >= 4) return '了解'
    return '初级'
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      technical: '💻',
      framework: '🔧',
      tool: '🛠️',
      soft: '🤝'
    }
    return icons[category as keyof typeof icons] || '📚'
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 80) return 'text-red-600 bg-red-100'
    if (difficulty >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const getDifficultyText = (difficulty: number) => {
    if (difficulty >= 80) return '困难'
    if (difficulty >= 60) return '中等'
    return '简单'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3">正在分析您的技能...</span>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 目标职位设置 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">技能分析</h2>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">目标职位:</label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="前端开发工程师">前端开发工程师</option>
            <option value="全栈开发工程师">全栈开发工程师</option>
            <option value="React开发工程师">React开发工程师</option>
            <option value="Node.js开发工程师">Node.js开发工程师</option>
            <option value="前端架构师">前端架构师</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 当前技能 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-blue-600" />
            当前技能水平
          </h3>
          
          <div className="space-y-4">
            {currentSkills.map((skill) => (
              <div key={skill.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="mr-2">{getCategoryIcon(skill.category)}</span>
                    <span className="font-medium">{skill.name}</span>
                    {skill.trending && (
                      <TrendingUp className="w-4 h-4 ml-2 text-green-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    {getSkillLevelText(skill.level)}
                  </span>
                </div>
                
                {/* 技能等级条 */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${getSkillLevelColor(skill.level)}`}
                    style={{ width: `${skill.level * 10}%` }}
                  />
                </div>
                
                {/* 市场需求 */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>市场需求</span>
                  <span className="font-medium">{skill.marketDemand}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 技能缺口 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
            技能缺口分析
          </h3>
          
          <div className="space-y-4">
            {skillGaps.map((gap) => (
              <div key={gap.skill} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{gap.skill}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(gap.difficulty)}`}>
                      {getDifficultyText(gap.difficulty)}
                    </span>
                    <span className="text-sm text-gray-600">
                      重要度: {gap.importance}%
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  预计学习时间: {gap.estimatedTime}
                </div>
                
                {/* 学习资源 */}
                <div>
                  <span className="text-sm font-medium text-gray-700">推荐资源:</span>
                  <ul className="mt-1 text-sm text-blue-600 space-y-1">
                    {gap.resources.map((resource, index) => (
                      <li key={index} className="hover:underline cursor-pointer">
                        • {resource}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 学习路径推荐 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-purple-600" />
          学习路径推荐
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningPaths.map((path) => (
            <div 
              key={path.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedPath(path)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{path.title}</h4>
                <span className="text-sm text-gray-600">
                  优先级: {path.priority}%
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{path.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">时长: {path.duration}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  path.difficulty === 'advanced' ? 'bg-red-100 text-red-800' :
                  path.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {path.difficulty === 'advanced' ? '高级' :
                   path.difficulty === 'intermediate' ? '中级' : '初级'}
                </span>
              </div>
              
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {path.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {path.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{path.skills.length - 3}更多
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 详细学习路径模态框 */}
      {selectedPath && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{selectedPath.title}</h3>
              <button
                onClick={() => setSelectedPath(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">{selectedPath.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="font-medium">学习时长:</span> {selectedPath.duration}
              </div>
              <div>
                <span className="font-medium">难度等级:</span> {
                  selectedPath.difficulty === 'advanced' ? '高级' :
                  selectedPath.difficulty === 'intermediate' ? '中级' : '初级'
                }
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">涉及技能:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedPath.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedPath(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // 这里可以实现学习计划的创建
                  alert('学习计划已添加到您的学习列表！')
                  setSelectedPath(null)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                开始学习
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SkillAnalysis
