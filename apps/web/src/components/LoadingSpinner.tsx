// apps/web/src/components/LoadingSpinner.tsx
import React from 'react'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-lg font-medium text-gray-900 mb-2">加载中...</div>
        <div className="text-sm text-gray-600">正在初始化AI Resume Agent</div>
      </div>
    </div>
  )
}

export default LoadingSpinner
