// apps/web/src/components/LearningPathPlanner.tsx
import React, { useState } from 'react'
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Play,
  ExternalLink,
  Target,
  BarChart3
} from 'lucide-react'

interface LearningResource {
  type: 'course' | 'book' | 'tutorial' | 'practice'
  title: string
  provider: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  url: string
  rating?: number
}

interface LearningMilestone {
  id: string
  title: string
  description: string
  timeEstimate: string
  completed: boolean
  resources: LearningResource[]
}

interface LearningPath {
  skillName: string
  totalTime: string
  difficulty: string
  milestones: LearningMilestone[]
  prerequisites: string[]
}

export const LearningPathPlanner: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState('')
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const [loading, setLoading] = useState(false)

  const popularSkills = [
    'TypeScript', 'React', 'Node.js', 'Python', 'Docker', 
    'AWS', 'GraphQL', 'MongoDB', '机器学习', '数据分析'
  ]

  const generateLearningPath = async (skill: string) => {
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockPath: LearningPath = {
        skillName: skill,
        totalTime: '6-8周',
        difficulty: 'intermediate',
        prerequisites: skill === 'TypeScript' ? ['JavaScript基础'] : [],
        milestones: [
          {
            id: '1',
            title: '基础概念学习',
            description: `了解${skill}的核心概念和基本语法`,
            timeEstimate: '1-2周',
            completed: false,
            resources: [
              {
                type: 'course',
                title: `${skill}入门课程`,
                provider: '慕课网',
                duration: '10小时',
                difficulty: 'beginner',
                url: '#',
                rating: 4.5
              },
              {
                type: 'book',
                title: `${skill}权威指南`,
                provider: '技术书籍',
                duration: '300页',
                difficulty: 'intermediate',
                url: '#'
              }
            ]
          },
          {
            id: '2',
            title: '实践项目',
            description: `通过实际项目应用${skill}技能`,
            timeEstimate: '2-3周',
            completed: false,
            resources: [
              {
                type: 'tutorial',
                title: `${skill}实战教程`,
                provider: 'GitHub',
                duration: '20小时',
                difficulty: 'intermediate',
                url: '#'
              },
              {
                type: 'practice',
                title: '练习项目集',
                provider: '开源社区',
                duration: '自定义',
                difficulty: 'intermediate',
                url: '#'
              }
            ]
          },
          {
            id: '3',
            title: '进阶应用',
            description: `掌握${skill}的高级特性和最佳实践`,
            timeEstimate: '2-3周',
            completed: false,
            resources: [
              {
                type: 'course',
                title: `${skill}高级课程`,
                provider: 'Udemy',
                duration: '15小时',
                difficulty: 'advanced',
                url: '#'
              }
            ]
          }
        ]
      }
      
      setLearningPath(mockPath)
    } catch (error) {
      console.error('生成学习路径失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleMilestone = (milestoneId: string) => {
    if (!learningPath) return
    
    setLearningPath({
      ...learningPath,
      milestones: learningPath.milestones.map(milestone =>
        milestone.id === milestoneId 
          ? { ...milestone, completed: !milestone.completed }
          : milestone
      )
    })
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'course': return '🎥'
      case 'book': return '📚'
      case 'tutorial': return '📝'
      case 'practice': return '💻'
      default: return '📖'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          学习路径规划
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">选择要学习的技能</label>
            <div className="flex gap-2 mb-4">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">选择技能...</option>
                {popularSkills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              
              <button
                onClick={() => generateLearningPath(selectedSkill)}
                disabled={!selectedSkill || loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '生成中...' : '生成路径'}
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">热门技能：</span>
            {popularSkills.slice(0, 5).map(skill => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 学习路径展示 */}
      {learningPath && (
        <div className="space-y-6">
          {/* 路径概览 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{learningPath.skillName} 学习路径</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    预计时间：{learningPath.totalTime}
                  </div>
                  <span className={`px-2 py-1 rounded ${getDifficultyColor(learningPath.difficulty)}`}>
                    {learningPath.difficulty === 'beginner' ? '初级' :
                     learningPath.difficulty === 'intermediate' ? '中级' : '高级'}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((learningPath.milestones.filter(m => m.completed).length / learningPath.milestones.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">完成进度</div>
              </div>
            </div>

            {/* 前置要求 */}
            {learningPath.prerequisites.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">前置要求</h4>
                <div className="flex flex-wrap gap-2">
                  {learningPath.prerequisites.map((prereq, index) => (
                    <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 学习里程碑 */}
          <div className="space-y-4">
            {learningPath.milestones.map((milestone, index) => (
              <div key={milestone.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleMilestone(milestone.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition ${
                      milestone.completed
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {milestone.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-semibold ${milestone.completed ? 'text-green-700' : 'text-gray-900'}`}>
                        {milestone.title}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        {milestone.timeEstimate}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{milestone.description}</p>
                    
                    {/* 学习资源 */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-700">推荐资源</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {milestone.resources.map((resource, resIndex) => (
                          <div key={resIndex} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getResourceIcon(resource.type)}</span>
                                <span className="font-medium text-sm">{resource.title}</span>
                              </div>
                              
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                            
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>{resource.provider}</span>
                              <div className="flex items-center gap-2">
                                <span>{resource.duration}</span>
                                {resource.rating && (
                                  <span className="flex items-center gap-1">
                                    ⭐ {resource.rating}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LearningPathPlanner
