// apps/web/src/pages/LoginPage.tsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { auth } from '../lib/supabase'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('请填写所有字段')
      return
    }

    setLoading(true)
    
    try {
      const { data, error } = await auth.signIn(formData.email, formData.password)
      
      if (error) {
        toast.error(error.message || '登录失败')
        return
      }

      toast.success('登录成功！')
      navigate('/dashboard')
    } catch (error) {
      toast.error('登录失败，请检查您的邮箱和密码')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await auth.signInWithProvider(provider)
      if (error) {
        toast.error(`${provider} 登录失败`)
      }
    } catch (error) {
      toast.error('登录失败')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            欢迎回来
          </h1>
          <p className="text-gray-600">
            登录您的账户以继续
          </p>
        </div>

        {/* 登录表单 */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 邮箱输入 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* 密码输入 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 记住我和忘记密码 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  记住我
                </label>
              </div>
              <button
                type="button"
                onClick={async () => {
                  if (formData.email) {
                    const { error } = await auth.resetPassword(formData.email)
                    if (error) {
                      toast.error('重置密码失败')
                    } else {
                      toast.success('重置链接已发送到您的邮箱')
                    }
                  } else {
                    toast.error('请输入邮箱地址')
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                忘记密码？
              </button>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </button>
          </form>

          {/* 分隔线 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">或者</span>
            </div>
          </div>

          {/* 社交登录 */}
          <div className="space-y-3">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
              使用 Google 登录
            </button>
            <button 
              onClick={() => handleSocialLogin('github')}
              className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center"
            >
              <img src="https://github.com/favicon.ico" alt="GitHub" className="w-5 h-5 mr-2" />
              使用 GitHub 登录
            </button>
          </div>

          {/* 注册链接 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              还没有账户？{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
