import React, { useState } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'

export interface Experience {
  id: string
  company: string
  position: string
  duration: string
  description: string
  achievements: string[]
}

interface ExperienceEditorProps {
  experiences: Experience[]
  onChange: (experiences: Experience[]) => void
}

export default function ExperienceEditor({ experiences, onChange }: ExperienceEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Experience>>({})

  const handleAdd = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      duration: '',
      description: '',
      achievements: []
    }
    onChange([...experiences, newExperience])
    setEditingId(newExperience.id)
    setFormData(newExperience)
  }

  const handleSave = () => {
    if (!editingId) return
    
    onChange(experiences.map(exp => 
      exp.id === editingId 
        ? { ...exp, ...formData, id: exp.id }
        : exp
    ))
    setEditingId(null)
    setFormData({})
  }

  const handleDelete = (id: string) => {
    onChange(experiences.filter(exp => exp.id !== id))
  }

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id)
    setFormData(exp)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">工作经历</h2>
        <button
          onClick={handleAdd}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          添加经历
        </button>
      </div>

      {experiences.map((exp) => (
        <div key={exp.id} className="border rounded-lg p-4">
          {editingId === exp.id ? (
            <div className="space-y-3">
              <input
                type="text"
                value={formData.company || ''}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                placeholder="公司名称"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                value={formData.position || ''}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                placeholder="职位"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                value={formData.duration || ''}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="时间段 (如: 2020.01 - 2023.12)"
                className="w-full px-3 py-2 border rounded"
              />
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="工作描述"
                className="w-full px-3 py-2 border rounded h-24"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setEditingId(null)
                    setFormData({})
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">{exp.duration}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
