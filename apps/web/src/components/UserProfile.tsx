// apps/web/src/components/UserProfile.tsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { User, Settings, Save, Upload, X } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  name: string
  avatar_url?: string
  phone?: string
  bio?: string
  linkedin_url?: string
  github_url?: string
  current_role?: string
  experience_level?: string
  skills: string[]
  interests: string[]
  created_at: string
  updated_at: string
}

const UserProfileComponent: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setProfile(data)
      } else {
        // 创建新的用户档案
        const newProfile: Partial<UserProfile> = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || '',
          skills: [],
          interests: []
        }

        const { data: createdProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert([newProfile])
          .select()
          .single()

        if (createError) throw createError
        setProfile(createdProfile)
      }
    } catch (error) {
      console.error('加载用户档案失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return

    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
        .select()
        .single()

      if (error) throw error
      
      setProfile(data)
      setIsEditing(false)
    } catch (error) {
      console.error('更新档案失败:', error)
      alert('更新失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !profile) return

    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB')
      return
    }

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      await updateProfile({ avatar_url: data.publicUrl })
    } catch (error) {
      console.error('头像上传失败:', error)
      alert('头像上传失败')
    } finally {
      setUploading(false)
    }
  }

  const addSkill = (skill: string) => {
    if (!profile || !skill.trim()) return
    
    const newSkills = [...profile.skills, skill.trim()]
    setProfile({ ...profile, skills: newSkills })
  }

  const removeSkill = (index: number) => {
    if (!profile) return
    
    const newSkills = profile.skills.filter((_, i) => i !== index)
    setProfile({ ...profile, skills: newSkills })
  }

  const addInterest = (interest: string) => {
    if (!profile || !interest.trim()) return
    
    const newInterests = [...profile.interests, interest.trim()]
    setProfile({ ...profile, interests: newInterests })
  }

  const removeInterest = (index: number) => {
    if (!profile) return
    
    const newInterests = profile.interests.filter((_, i) => i !== index)
    setProfile({ ...profile, interests: newInterests })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3">加载用户档案...</span>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">无法加载用户档案</p>
        <button 
          onClick={loadProfile}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* 头部 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-2xl font-semibold flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            个人资料
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {isEditing ? '取消编辑' : '编辑资料'}
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 头像和基本信息 */}
          <div className="flex items-start space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="头像"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700">
                  <Upload className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
              
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              {/* 姓名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.name || '未设置'}</p>
                )}
              </div>

              {/* 邮箱 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱
                </label>
                <p className="text-gray-600">{profile.email}</p>
              </div>

              {/* 电话 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  电话
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入手机号码"
                  />
                ) : (
                  <p className="text-gray-900">{profile.phone || '未设置'}</p>
                )}
              </div>
            </div>
          </div>

          {/* 个人简介 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              个人简介
            </label>
            {isEditing ? (
              <textarea
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="请简单介绍一下自己..."
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-wrap">
                {profile.bio || '暂无个人简介'}
              </p>
            )}
          </div>

          {/* 职业信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                当前职位
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.current_role || ''}
                  onChange={(e) => setProfile({ ...profile, current_role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例：前端开发工程师"
                />
              ) : (
                <p className="text-gray-900">{profile.current_role || '未设置'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                经验水平
              </label>
              {isEditing ? (
                <select
                  value={profile.experience_level || ''}
                  onChange={(e) => setProfile({ ...profile, experience_level: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择</option>
                  <option value="entry">入门级 (0-2年)</option>
                  <option value="junior">初级 (2-4年)</option>
                  <option value="mid">中级 (4-7年)</option>
                  <option value="senior">高级 (7-10年)</option>
                  <option value="expert">专家级 (10年以上)</option>
                </select>
              ) : (
                <p className="text-gray-900">
                  {profile.experience_level === 'entry' && '入门级 (0-2年)'}
                  {profile.experience_level === 'junior' && '初级 (2-4年)'}
                  {profile.experience_level === 'mid' && '中级 (4-7年)'}
                  {profile.experience_level === 'senior' && '高级 (7-10年)'}
                  {profile.experience_level === 'expert' && '专家级 (10年以上)'}
                  {!profile.experience_level && '未设置'}
                </p>
              )}
            </div>
          </div>

          {/* 社交链接 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={profile.linkedin_url || ''}
                  onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/your-profile"
                />
              ) : (
                <p className="text-gray-900">
                  {profile.linkedin_url ? (
                    <a 
                      href={profile.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.linkedin_url}
                    </a>
                  ) : '未设置'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitHub
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={profile.github_url || ''}
                  onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/your-username"
                />
              ) : (
                <p className="text-gray-900">
                  {profile.github_url ? (
                    <a 
                      href={profile.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.github_url}
                    </a>
                  ) : '未设置'}
                </p>
              )}
            </div>
          </div>

          {/* 技能标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              技能标签
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(index)}
                      className="ml-2 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            
            {isEditing && (
              <div className="flex">
                <input
                  type="text"
                  placeholder="添加技能..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSkill(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    addSkill(input.value)
                    input.value = ''
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                >
                  添加
                </button>
              </div>
            )}
          </div>

          {/* 兴趣标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              兴趣爱好
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.interests.map((interest, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  {interest}
                  {isEditing && (
                    <button
                      onClick={() => removeInterest(index)}
                      className="ml-2 hover:text-green-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            
            {isEditing && (
              <div className="flex">
                <input
                  type="text"
                  placeholder="添加兴趣..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addInterest(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    addInterest(input.value)
                    input.value = ''
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700"
                >
                  添加
                </button>
              </div>
            )}
          </div>

          {/* 保存按钮 */}
          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsEditing(false)
                  loadProfile() // 重新加载原始数据
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={saving}
              >
                取消
              </button>
              <button
                onClick={() => updateProfile(profile)}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                保存更改
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfileComponent
