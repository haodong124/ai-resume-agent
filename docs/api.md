# AI Resume Agent API 文档

**文件路径**: `docs/api.md`

## 基础信息

- **Base URL**: `http://localhost:8000` (开发环境)
- **Base URL**: `https://api.ai-resume.com` (生产环境)
- **认证**: Bearer Token (部分接口需要)
- **内容类型**: `application/json`

## API 端点列表

### 1. 职位推荐
- `POST /api/recommendations/jobs` - 获取职位推荐
- `POST /api/recommendations/explain` - 解释推荐理由

### 2. 模拟面试  
- `POST /api/interview/start` - 开始面试
- `POST /api/interview/answer` - 提交回答

### 3. 职业咨询
- `POST /api/career/chat` - 发送咨询消息

### 4. 技能分析
- `POST /api/skills/analyze` - 分析技能差距
- `POST /api/skills/learning-path` - 生成学习路径

### 5. 简历管理
- `POST /api/resumes` - 保存简历

## 详细接口文档

### 获取职位推荐

```http
POST /api/recommendations/jobs
Content-Type: application/json

{
  "resume": {
    "personalInfo": {
      "name": "张三",
      "email": "zhang@example.com"  
    },
    "skills": ["JavaScript", "React"],
    "experience": [...]
  },
  "options": {
    "limit": 10,
    "filters": {
      "location": ["北京", "上海"],
      "salaryMin": 20000
    }
  }
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "jobId": "1",
        "title": "前端开发工程师",
        "company": "字节跳动", 
        "matchScore": 87,
        "salaryRange": [25000, 40000],
        "requiredSkills": ["JavaScript", "React"],
        "missingSkills": ["TypeScript"]
      }
    ],
    "count": 1
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 开始模拟面试

```http
POST /api/interview/start
Content-Type: application/json

{
  "job_type": "frontend",
  "difficulty_level": "intermediate"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "session_id": "session_1234567890",
    "first_question": "请简单介绍一下自己",
    "total_questions": 5,
    "started_at": "2024-01-15T10:30:00Z"
  }
}
```

### 职业咨询对话

```http
POST /api/career/chat
Content-Type: application/json

{
  "message": "如何准备技术面试？",
  "context": {
    "user_id": "user_123"
  }
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "response": {
      "content": "技术面试准备建议...",
      "follow_up_questions": ["你想了解算法题准备方法吗？"],
      "action_items": ["复习数据结构", "练习编程题"]
    }
  }
}
```

## 错误处理

所有错误响应格式：
```json
{
  "success": false,
  "error": "错误描述",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 使用示例

### JavaScript
```javascript
// API客户端
const api = {
  baseURL: 'http://localhost:8000/api',
  
  async request(method, endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined
    })
    return response.json()
  },
  
  // 获取职位推荐
  async getJobRecommendations(resume, options) {
    return this.request('POST', '/recommendations/jobs', { resume, options })
  },
  
  // 开始面试
  async startInterview(jobType, difficulty = 'intermediate') {
    return this.request('POST', '/interview/start', { 
      job_type: jobType, 
      difficulty_level: difficulty 
    })
  }
}

// 使用示例
const recommendations = await api.getJobRecommendations(resumeData, { limit: 5 })
```

### Python
```python
import requests

class AIResumeAPI:
    def __init__(self, base_url='http://localhost:8000/api'):
        self.base_url = base_url
        
    def get_job_recommendations(self, resume, options=None):
        response = requests.post(
            f'{self.base_url}/recommendations/jobs',
            json={'resume': resume, 'options': options or {}}
        )
        return response.json()
        
    def start_interview(self, job_type, difficulty='intermediate'):
        response = requests.post(
            f'{self.base_url}/interview/start',
            json={'job_type': job_type, 'difficulty_level': difficulty}
        )
        return response.json()

# 使用示例
api = AIResumeAPI()
result = api.get_job_recommendations(resume_data, {'limit': 5})
```
