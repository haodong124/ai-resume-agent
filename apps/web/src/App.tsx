// apps/web/src/App.tsx - 主应用组件
// 文件路径: apps/web/src/App.tsx

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HomePage } from './pages/HomePage'
import { EditorPage } from './pages/EditorPage'
import { JobsMatchPage } from './pages/JobsMatchPage'
import { SkillRecommender } from './components/SkillRecommender'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/jobs-match" element={<JobsMatchPage />} />
          <Route path="/skills" element={<SkillRecommender />} />
        </Routes>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
