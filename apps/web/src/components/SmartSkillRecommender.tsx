// apps/web/src/components/SmartSkillRecommender.tsx
import React, { useState, useEffect } from 'react'
import { Sparkles, RefreshCw, Plus, Edit2, Check, X } from 'lucide-react'
import { SKILLS_DATABASE } from '../data/skillsDatabase'

interface SkillRecommendation {
  id: string
  name: string
  category: string
  level: 'understand' | 'proficient' | 'expert'
  description: string
  capabilities: string[]
  reason: string // AI生成的推荐理由
}

const SmartSkillRecommender: React.FC<{
  major: string
  targetPosition: string
  currentSkills: any[]
  onAddSkills: (skills: any[]) => void
}> = ({ major, targetPosition, currentSkills, onAddSkills }) => {
  const [recommendations, setRecommendations] = useState<SkillRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set())

  // 智能推荐技能
  const generateRecommendations = async () => {
    setIsLoading(true)
    
    // 第一步：从本地数据库获取基础技能
    const baseSkills = getBaseSkillsFromDB(major, targetPosition)
    
    // 第二步：使用AI增强和个性化
    try {
      const prompt = `
基于以下信息推荐技能：
- 专业：${major}
- 目标职位：${targetPosition}
- 已有技能：${currentSkills.map(s => s.name).join(', ')}

请推荐8个最相关的技能，包括：
1. 核心技术技能（3-4个）
2. 工具软件（2-3个）
3. 软技能（1-2个）

对每个技能，说明：
- 为什么推荐（一句话）
- 建议的熟练度（了解/熟练/精通）
- 这个技能能做什么（2-3个要点）

返回JSON格式。
      `

      const response = await callAI(prompt)
      const aiRecommendations = parseAIResponse(response)
      
      // 合并本地数据和AI建议
      const merged = mergeRecommendations(baseSkills, aiRecommendations)
      setRecommendations(merged)
      
    } catch (error) {
      // 如果AI失败，使用纯本地数据
      setRecommendations(baseSkills)
    } finally {
      setIsLoading(false)
    }
  }

  // 从数据库获取基础技能
  const getBaseSkillsFromDB = (major: string, position: string) => {
    const majorSkills = SKILLS_DATABASE.majors[major] || {}
    const positionSkills = SKILLS_DATABASE.positions[position] || {}
    
    // 智能组合技能
    const skills: SkillRecommendation[] = []
    
    // 添加专业核心技能
    Object.entries(majorSkills).forEach(([category, skillList]) => {
      skillList.slice(0, 2).forEach(skillName => {
        skills.push(createSkillRecommendation(skillName, category))
      })
    })
    
    // 添加职位必备技能
    Object.entries(positionSkills).forEach(([category, skillList]) => {
      skillList.slice(0, 2).forEach(skillName => {
        if (!skills.find(s => s.name === skillName)) {
          skills.push(createSkillRecommendation(skillName, category))
        }
      })
    })
    
    return skills.slice(0, 8)
  }

  // 创建技能推荐对象
  const createSkillRecommendation = (name: string, category: string): SkillRecommendation => {
    const details = SKILLS_DATABASE.skillDetails[name] || {}
    return {
      id: Date.now().toString() + Math.random(),
      name,
      category,
      level: 'proficient',
      description: details.description || `精通${name}的使用和应用`,
      capabilities: details.capabilities || [
        `熟练使用${name}完成工作`,
        `解决${name}相关的技术问题`,
        `优化和改进${name}的应用`
      ],
      reason: `${targetPosition}岗位常用技能`
    }
  }

  // 编辑技能
  const handleEditSkill = (skill: SkillRecommendation) => {
    setEditingSkill(skill.id)
  }

  // 保存编辑
  const handleSaveEdit = (skill: SkillRecommendation, updates: Partial<SkillRecommendation>) => {
    setRecommendations(prev => 
      prev.map(s => s.id === skill.id ? { ...s, ...updates } : s)
    )
    setEditingSkill(null)
  }

  // 批量添加选中的技能
  const handleAddSelected = () => {
    const skillsToAdd = recommendations
      .filter(skill => selectedSkills.has(skill.id))
      .map(skill => ({
        id: Date.now().toString() + Math.random(),
        name: skill.name,
        category: skill.category,
        level: skill.level,
        description: `${skill.description}。${skill.capabilities.join('、')}`
      }))
    
    onAddSkills(skillsToAdd)
    setSelectedSkills(new Set())
    toast.success(`已添加${skillsToAdd.length}个技能`)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          智能技能推荐
        </h3>
        <button
          onClick={generateRecommendations}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                   disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {recommendations.length > 0 ? '换一批' : '生成推荐'}
        </button>
      </div>

      {/* 推荐技能列表 */}
      {recommendations.length > 0 && (
        <>
          <div className="grid gap-4 mb-4">
            {recommendations.map(skill => (
              <div key={skill.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedSkills.has(skill.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedSkills)
                        if (e.target.checked) {
                          newSelected.add(skill.id)
                        } else {
                          newSelected.delete(skill.id)
                        }
                        setSelectedSkills(newSelected)
                      }}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      {editingSkill === skill.id ? (
                        // 编辑模式
                        <div className="space-y-2">
                          <input
                            type="text"
                            defaultValue={skill.name}
                            className="w-full px-2 py-1 border rounded"
                            onBlur={(e) => handleSaveEdit(skill, { name: e.target.value })}
                          />
                          <select
                            defaultValue={skill.level}
                            className="px-2 py-1 border rounded"
                            onChange={(e) => handleSaveEdit(skill, { level: e.target.value as any })}
                          >
                            <option value="understand">了解</option>
                            <option value="proficient">熟练</option>
                            <option value="expert">精通</option>
                          </select>
                          <textarea
                            defaultValue={skill.description}
                            className="w-full px-2 py-1 border rounded"
                            rows={2}
                            onBlur={(e) => handleSaveEdit(skill, { description: e.target.value })}
                          />
                        </div>
                      ) : (
                        // 显示模式
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{skill.name}</h4>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                              {skill.category}
                            </span>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                              {skill.level === 'expert' ? '精通' : skill.level === 'proficient' ? '熟练' : '了解'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                          <div className="space-y-1">
                            {skill.capabilities.map((cap, idx) => (
                              <div key={idx} className="text-xs text-gray-500 flex items-start gap-1">
                                <span>•</span>
                                <span>{cap}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-purple-600 mt-2">
                            💡 {skill.reason}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => editingSkill === skill.id ? setEditingSkill(null) : handleEditSkill(skill)}
                    className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                  >
                    {editingSkill === skill.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Edit2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm text-gray-500">
              已选择 {selectedSkills.size} 个技能
            </span>
            <button
              onClick={handleAddSelected}
              disabled={selectedSkills.size === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加到简历
            </button>
          </div>
        </>
      )}
    </div>
  )
}
