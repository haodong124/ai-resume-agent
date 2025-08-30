import React, { useState } from 'react'
import { Plus, Trash2, Link } from 'lucide-react'

export interface Project {
  id: string
  name: string
  role: string
  duration: string
  description: string
  technologies: string
  link?: string
}

interface ProjectEditorProps {
  projects: Project[]
  onChange: (projects: Project[]) => void
}

export default function ProjectEditor({ projects, onChange }: ProjectEditorProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Partial<Project>>({})

  const handleAdd = () => {
    if (!formData.name) return
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.name || '',
      role: formData.role || '',
      duration: formData.duration || '',
      description: formData.description || '',
      technologies: formData.technologies || '',
      link: formData.link
    }
    
    onChange([...projects, newProject])
    setFormData({})
    setIsAdding(false)
  }

  const handleDelete = (id: string) => {
    onChange(projects.filter(proj => proj.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">项目经历</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            添加项目
          </button>
        )}
      </div>

      {isAdding && (
        <div className="border rounded-lg p-4 space-y-3">
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="项目名称"
            className="w-full px-3 py-2 border rounded"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={formData.role || ''}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              placeholder="你的角色"
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              value={formData.duration || ''}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              placeholder="时间段"
              className="px-3 py-2 border rounded"
            />
          </div>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="项目描述"
            className="w-full px-3 py-2 border rounded h-24"
          />
          <input
            type="text"
            value={formData.technologies || ''}
            onChange={(e) => setFormData({...formData, technologies: e.target.value})}
            placeholder="使用技术 (用逗号分隔)"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="url"
            value={formData.link || ''}
            onChange={(e) => setFormData({...formData, link: e.target.value})}
            placeholder="项目链接 (可选)"
            className="w-full px-3 py-2 border rounded"
          />
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

      {projects.map((project) => (
        <div key={project.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                {project.name}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                    <Link className="w-4 h-4" />
                  </a>
                )}
              </h3>
              <p className="text-gray-600">{project.role} | {project.duration}</p>
            </div>
            <button
              onClick={() => handleDelete(project.id)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-700 mb-2">{project.description}</p>
          <div className="flex flex-wrap gap-1">
            {project.technologies.split(',').map((tech, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                {tech.trim()}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
