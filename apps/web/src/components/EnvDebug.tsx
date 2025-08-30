import React from 'react'

export default function EnvDebug() {
  const envVars = {
    openAI: import.meta.env.VITE_OPENAI_API_KEY ? '✅ 已设置' : '❌ 未设置',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? '✅ 已设置' : '❌ 未设置',
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ 已设置' : '❌ 未设置',
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs">
      <h3 className="font-bold mb-2">环境变量状态</h3>
      <div className="space-y-1">
        <p>OpenAI API: {envVars.openAI}</p>
        <p>Supabase URL: {envVars.supabaseUrl}</p>
        <p>Supabase Key: {envVars.supabaseKey}</p>
      </div>
    </div>
  )
}
