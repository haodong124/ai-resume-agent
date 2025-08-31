// 简化的本地存储管理，避免Supabase复杂依赖

export function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('保存到本地存储失败:', error)
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('从本地存储读取失败:', error)
    return defaultValue
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('从本地存储删除失败:', error)
  }
}

// 简单的分享链接生成
export function generateShareLink(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `${window.location.origin}/share/${result}`
}

// 模拟导出权限检查
export function checkExportPermission(): { canExport: boolean; currentClicks: number } {
  return {
    canExport: true, // 简化版本默认允许导出
    currentClicks: 0
  }
}
