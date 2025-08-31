import React from 'react'
import { Check } from 'lucide-react'

interface TemplateSelectorProps {
  selected: string
  onChange: (template: string) => void
}

const templates = [
  {
    id: 'standard',
    name: '标准模板',
    description: '经典简洁，适合大多数行业',
    color: 'border-blue-200'
  },
  {
    id: 'modern',
    name: '现代模板',
    description: '时尚渐变，适合创意行业',
    color: 'border-purple-200'
  },
  {
    id: 'professional',
    name: '专业模板',
    description: '商务正式，适合金融法律',
    color: 'border-gray-200'
  },
  {
    id: 'creative',
    name: '创意模板',
    description: '个性鲜明，适合设计师',
    color: 'border-green-200'
  },
  {
    id: 'minimal',
    name: '极简模板',
    description: '简约清爽，突出内容',
    color: 'border-indigo-200'
  }
]

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selected,
  onChange,
}) => {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-3">选择模板</h4>
      <div className="space-y-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onChange(template.id)}
            className={`w-full p-3 rounded-lg border-2 text-left transition-all hover:shadow-md ${
              selected === template.id
                ? `${template.color} bg-blue-50 border-blue-300`
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h5 className="font-medium text-gray-800">{template.name}</h5>
                  {selected === template.id && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {template.description}
                </p>
              </div>
              <div className="w-8 h-10 bg-gray-100 rounded border ml-3 flex-shrink-0 relative overflow-hidden">
                <div className={`w-full h-2 ${
                  template.id === 'modern' ? 'bg-gradient-to-r from-blue-400 to-purple-400' :
                  template.id === 'professional' ? 'bg-gray-700' :
                  template.id === 'creative' ? 'bg-green-400' :
                  template.id === 'minimal' ? 'bg-indigo-300' :
                  'bg-blue-300'
                }`} />
                <div className="p-1 space-y-1">
                  <div className="h-1 bg-gray-300 rounded w-3/4" />
                  <div className="h-0.5 bg-gray-200 rounded w-full" />
                  <div className="h-0.5 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
