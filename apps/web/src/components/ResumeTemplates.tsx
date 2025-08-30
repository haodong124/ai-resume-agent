import React from 'react'

interface Template {
  id: string
  name: string
  preview: string
  color: string
}

const templates: Template[] = [
  { id: 'standard', name: '标准简历', preview: '经典排版', color: 'bg-blue-500' },
  { id: 'modern', name: '现代风格', preview: '简约设计', color: 'bg-green-500' },
  { id: 'creative', name: '创意模板', preview: '独特布局', color: 'bg-purple-500' },
  { id: 'minimal', name: '极简主义', preview: '清晰简洁', color: 'bg-gray-500' }
]

interface ResumeTemplatesProps {
  selectedTemplate: string
  onSelectTemplate: (id: string) => void
}

export default function ResumeTemplates({ selectedTemplate, onSelectTemplate }: ResumeTemplatesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelectTemplate(template.id)}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedTemplate === template.id
              ? 'border-blue-500 shadow-lg'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className={`h-32 ${template.color} rounded mb-2 opacity-10`}></div>
          <h3 className="font-semibold">{template.name}</h3>
          <p className="text-sm text-gray-600">{template.preview}</p>
        </button>
      ))}
    </div>
  )
}
