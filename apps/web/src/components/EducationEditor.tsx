import React, { useState } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'

export interface Education {
  id: string
  school: string
  degree: string
  major: string
  duration: string
  gpa?: string
}

interface EducationEditorProps {
  educations: Education[]
  onChange: (educations: Education[]) => void
}

export default function EducationEditor({ educations, onChange }: EducationEditorProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Partial<Education>>({})

  const handleAdd = () => {
    if (!formData.school || !formData.degree) return
    
    const newEducation: Education = {
      id: Date.now().toString(),
      school: formData.school || '',
      degree: formData.degree || '',
      major: formData.major || '',
      duration: formData.duration || '',
      gpa: formData.gpa
    }
    
    onChange([...educations, newEducation])
    setFormData({})
    setIsAdding(false)
  }

  const handleDelete = (id: string) => {
    onChange(educations.filter(edu => edu.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">教育背景</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            添加教育
          </button>
        )}
      </div>

      {isAdding && (
        <div className="border rounded-lg p-4 space-y-3">
          <input
            type="text"
            value={formData.school || ''}
            onChange={(e) => setFormData({...formData, school: e.target.value})}
            placeholder="学校名称"
            className="w-full px-3 py-2 border rounded"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={formData.degree || ''}
              onChange={(e) => setFormData({...formData, degree: e.target.value})}
              placeholder="学位 (如: 本科)"
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              value={formData.major || ''}
              onChange={(e) => setFormData({...formData, major: e.target.value})}
              placeholder="专业"
              className="px-3 py-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={formData.duration || ''}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              placeholder="时间 (如: 2016-2020)"
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              value={formData.gpa || ''}
              onChange={(e) => setFormData({...formData, gpa: e.target.value})}
              placeholder="GPA (可选)"
              className="px-3 py-2 border rounded"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              添加
            </button>
            <button
              onClick={() => {
                setIsAdding(false)
                setFormData({})
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {educations.map((edu) => (
        <div key={edu.id} className="border rounded-lg p-4 flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{edu.school}</h3>
            <p className="text-gray-600">{edu.degree} - {edu.major}</p>
            <p className="text-sm text-gray-500">{edu.duration}</p>
            {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
          </div>
          <button
            onClick={() => handleDelete(edu.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
