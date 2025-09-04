import React, { useState } from 'react'
import { Plus, Trash2, Sparkles, Award } from 'lucide-react'
import type { Skill } from '../types/resume'

interface SkillEditorProps {
  skills: Skill[]
  onChange: (skills: Skill[]) => void
}

export const SkillEditor: React.FC<SkillEditorProps> = ({ skills, onChange }) => {
  const [isAdding, setIsAdding] = useState(false)
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: '',
    level: 'Intermediate',
    category: '技术技能'
  })

  const skillCategories = [
    '技术技能',
    '编程语言', 
    '框架工具',
    '软技能',
    '语言能力',
    '其他技能'
  ]

  const levelLabels = {
    Beginner: '初级',
    Intermediate: '中级', 
    Advanced: '高级',
    Expert: '专家'
  }

  const handleAddSkill = () => {
    if (!newSkill.name?.trim()) return

    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name,
      level: newSkill.level as Skill['level'],
      category: newSkill.category || '技术技能',
      description: newSkill.description
    }

    onChange([...skills, skill])
    setNewSkill({ name: '', level: 'Intermediate', category: '技术技能' })
    setIsAdding(false)
  }

  const handleRemoveSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index))
  }

  const handleUpdateSkill = (index: number, field: keyof Skill, value: any) => {
    const updatedSkills = skills.map((skill, i) => 
      i === index ? { ...skill, [field]: value } : skill
    )
    onChange(updatedSkills)
  }

  // 按分类分组技能
  const groupedSkills = skills.reduce((groups, skill, index) => {
    const category = skill.category || '其他技能'
    if (!groups[category]) groups[category] = []
    groups[category].push({ skill, index })
    return groups
  }, {} as Record<string, Array<{ skill: Skill, index: number }>>)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">专业技能</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {/* TODO: 连接技能推荐API */}}
            className="flex items-center px-3 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI推荐
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加技能
          </button>
        </div>
      </div>

      {/* 添加新技能表单 */}
      {isAdding && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium mb-3">添加新技能</h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              value={newSkill.name || ''}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="技能名称"
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <select
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as Skill['level'] })}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              {Object.entries(levelLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <select
            value={newSkill.category}
            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
          >
            {skillCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleAddSkill}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              添加
            </button>
          </div>
        </div>
      )}

      {/* 技能列表 - 按分类显示 */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-800 mb-3">{category}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categorySkills.map(({ skill, index }) => (
                <div key={skill.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => handleUpdateSkill(index, 'name', e.target.value)}
                      className="font-medium text-gray-900 bg-transparent border-none p-0 focus:ring-0"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => handleUpdateSkill(index, 'level', e.target.value)}
                      className="text-sm text-gray-600 bg-transparent border-none p-0 focus:ring-0"
                    >
                      {Object.entries(levelLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && !isAdding && (
        <div className="text-center py-12 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无专业技能，点击上方按钮添加</p>
        </div>
      )}
    </div>
  )
}

export default SkillEditor
