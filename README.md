# AI简历助手 🚀

一个基于 AI 的智能简历制作和优化平台，帮助求职者创建ATS友好的专业简历。

## ✨ 核心功能

- 🤖 **AI 智能优化** - 自动优化简历内容，提升ATS通过率
- 📊 **职位匹配分析** - 分析简历与目标职位的匹配度
- 💡 **智能技能推荐** - 基于背景推荐相关技能
- 📄 **多模板支持** - 5种专业模板，适配不同行业
- 📥 **高质量导出** - 支持PDF高清导出
- 🔄 **实时预览** - 编辑即时预览效果
- 💬 **AI 助手** - 实时对话，获取优化建议

## 🛠 技术栈

### 前端
- **React 18** + **TypeScript** - 现代化前端框架
- **Vite** - 快速构建工具
- **Tailwind CSS** - 原子化CSS框架
- **Zustand** - 轻量级状态管理
- **React Router** - 客户端路由

### AI集成
- **OpenAI API** - GPT模型用于内容优化
- **Anthropic Claude** - 高质量AI对话

### 工具库
- **Lucide React** - 美观的图标库
- **html2canvas** + **jsPDF** - PDF生成
- **React Hot Toast** - 消息提示

### 后端 (可选)
- **Netlify Functions** - Serverless函数
- **Supabase** - 数据库和认证

## 📁 项目结构

```
ai-resume-agent/
├── apps/
│   ├── web/                    # 前端应用
│   │   ├── src/
│   │   │   ├── components/     # React组件
│   │   │   ├── pages/         # 页面组件
│   │   │   ├── features/      # 功能模块
│   │   │   ├── lib/           # 工具库
│   │   │   └── main.tsx       # 应用入口
│   │   ├── public/            # 静态资源
│   │   └── package.json
│   └── functions/             # Serverless函数
├── packages/
│   ├── agent-core/            # AI代理核心
│   ├── agent-capabilities/    # AI能力模块
│   └── ui-bridge/             # 类型定义
├── netlify.toml              # Netlify配置
└── package.json              # 根配置
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/ai-resume-agent.git
cd ai-resume-agent
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

复制 `.env.example` 为 `.env` 并配置：

```bash
# API Keys (可选)
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key

# Supabase (可选)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 功能开关
VITE_ENABLE_AI_FEATURES=true
```

### 4. 启动开发服务器

```bash
# 启动前端应用
cd apps/web
npm run dev
```

访问 `http://localhost:3000` 查看应用。

### 5. 构建生产版本

```bash
cd apps/web
npm run build
```

## 📦 部署指南

### Netlify 部署 (推荐)

1. **连接仓库**
   ```bash
   # 推送到GitHub
   git remote add origin https://github.com/your-username/ai-resume-agent.git
   git push -u origin main
   ```

2. **配置Netlify**
   - Build command: `npm install && npm run build`
   - Publish directory: `apps/web/dist`
   - Base directory: `apps/web`

3. **环境变量**
   在Netlify控制台设置必要的环境变量。

### Vercel 部署

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel

部署项目
bashcd apps/web
vercel

配置构建设置

Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install



🎯 使用指南
基础使用

创建简历

访问首页，点击"开始制作简历"
填写个人信息、工作经历、教育背景等
实时预览简历效果


选择模板

在编辑器中选择适合的模板
支持标准、现代、专业、创意、极简5种风格


AI优化

开启AI助手获得实时建议
使用职位匹配功能分析差距
获取个性化技能推荐


导出简历

支持PDF、PNG格式导出
高质量打印效果
一键分享功能



高级功能
AI职位匹配
typescript// 使用职位匹配API
const matchResult = await ResumeAPI.matchJobs(resumeData, jobDescription)
console.log(`匹配度: ${matchResult.score}%`)
技能推荐
typescript// 获取技能推荐
const suggestions = await ResumeAPI.getSuggestions(resumeData)
console.log(suggestions.recommendedSkills)
🔧 开发指南
添加新模板

创建模板组件
typescript// src/components/templates/CustomTemplate.tsx
export const CustomTemplate: React.FC<ResumePreviewProps> = ({ data }) => {
  return (
    <div className="custom-template">
      {/* 模板内容 */}
    </div>
  )
}

注册模板
typescript// src/components/TemplateSelector.tsx
const templates = [
  // ...existing templates
  {
    id: 'custom',
    name: '自定义模板',
    description: '您的模板描述',
    component: CustomTemplate
  }
]


扩展AI功能

添加新的AI能力
typescript// packages/agent-capabilities/src/NewAgent.ts
export class NewAgent {
  constructor(private agent: AgentCore) {}
  
  async processResume(data: ResumeData) {
    // 实现AI逻辑
  }
}

集成到API
typescript// apps/functions/src/ai/new-feature.ts
export const handler: Handler = async (event) => {
  const agent = new AgentCore({ llm: 'openai' })
  const processor = new NewAgent(agent)
  // 处理请求
}


自定义样式
css/* src/index.css - 添加自定义样式 */
.custom-component {
  @apply bg-gradient-to-r from-blue-500 to-purple-600;
  /* 您的自定义样式 */
}
🧪 测试
bash# 运行类型检查
npm run type-check

# 运行代码检查
npm run lint

# 构建测试
npm run build
📈 性能优化

代码分割: 使用动态导入分割大型组件
图片优化: 使用WebP格式和懒加载
缓存策略: 利用浏览器缓存和CDN
包大小: 定期分析和优化依赖

🔒 安全性

数据保护: 所有简历数据本地存储
API安全: 使用环境变量保护API密钥
内容安全: CSP头部防护
HTTPS: 强制使用安全连接

🐛 常见问题
构建错误
问题: "EditorPage" is not exported
解决: 确保组件正确导出
typescriptexport const EditorPage: React.FC = () => { /* ... */ }
export default EditorPage
问题: PDF导出失败
解决: 检查html2canvas和jsPDF版本兼容性
问题: AI功能不可用
解决: 确保API密钥配置正确且有余额
部署问题
问题: Netlify构建失败
解决: 检查Node版本和依赖安装
问题: 路由404错误
解决: 确保重定向规则配置正确
🤝 贡献指南

Fork 项目
创建功能分支 (git checkout -b feature/amazing-feature)
提交更改 (git commit -m 'Add amazing feature')
推送分支 (git push origin feature/amazing-feature)
创建 Pull Request

代码规范

使用 TypeScript 严格模式
遵循 ESLint 规则
组件使用函数式写法
样式使用 Tailwind CSS

📝 更新日志
v1.0.0 (2024-01-20)

✨ 初始版本发布
🎨 5种专业简历模板
🤖 AI智能优化功能
📊 职位匹配分析
💡 技能推荐系统

📄 许可证
MIT License - 详见 LICENSE 文件
💬 联系我们

项目地址: GitHub
问题反馈: Issues
功能建议: Discussions

🙏 致谢

React - 用户界面库
Tailwind CSS - CSS框架
OpenAI - AI技术支持
Netlify - 部署平台


⭐ 如果这个项目对您有帮助，请给个星标支持！
