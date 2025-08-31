// 简化的本地存储管理，替代复杂的Supabase

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

// 模拟创建分享链接
export async function createShareLink(resumeId: string): Promise<string> {
  return generateShareLink()
}

// 模拟用户查找
export async function findOrCreateUser(email: string) {
  return { id: 'mock-user-id', email }
}

// 模拟简历保存
export async function saveResume(userId: string, resumeData: any, template: string) {
  saveToLocalStorage(`resume_${userId}`, { resumeData, template })
  return { success: true }
}

// 模拟简历加载
export async function loadResume(userId: string) {
  return loadFromLocalStorage(`resume_${userId}`, null)
}
