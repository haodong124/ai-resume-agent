import React, { useState } from 'react'
import { Sparkles, Plus } from 'lucide-react'

interface Skill {
  name: string
  category: string
  selected: boolean
}

export default function SkillRecommendation({ onAddSkills }: { onAddSkills: (skills: string[]) => void }) {
  const [recommendedSkills, setRecommendedSkills] = useState<Skill[]>([
    { name: 'React', category: '前端框架', selected: false },
    { name: 'TypeScript', category: '编程语言', selected: false },
    { name: 'Node.js', category: '后端技术', selected: false },
    { name: '项目管理', category: '软技能', selected: false },
    { name: 'Git', category: '工具', selected: false },
    { name: 'Docker', category: '容器技术', selected: false },
    { name: 'MySQL', category: '数据库', selected: false },
    { name: '敏捷开发', category: '方法论', selected: false }
  ])

  const toggleSkill = (index: number) => {
    const updated = [...recommendedSkills]
    updated[index].selected = !updated[index].selected
    setRecommendedSkills(updated)
  }

  const handleAddSelected = () => {
    const selected = recommendedSkills
      .filter(skill => skill.selected)
      .map(skill => skill.name)
    onAddSkills(selected)
  }

  const categories = [...new Set(recommendedSkills.map(s => s.category))]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
          AI 技能推荐
        </h2>
        <button
          onClick={handleAddSelected}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加选中技能
        </button>
      </div>

      <div className="space-y-4">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-700 mb-2">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {recommendedSkills
                .filter(skill => skill.category === category)
                .map((skill, index) => (
                  <button
                    key={skill.name}
                    onClick={() => toggleSkill(recommendedSkills.indexOf(skill))}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      skill.selected
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {skill.name}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
