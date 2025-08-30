const STORAGE_KEY = 'ai-resume-data'

export function saveToLocalStorage(data: any) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('保存失败:', error)
    return false
  }
}

export function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('加载失败:', error)
    return null
  }
}

export function clearLocalStorage() {
  localStorage.removeItem(STORAGE_KEY)
}
