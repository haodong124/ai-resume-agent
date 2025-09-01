// scripts/seed.js
const { Pool } = require('pg')
require('dotenv').config()

const sampleJobs = [
  {
    title: '高级前端工程师',
    company: '美团',
    description: '负责美团外卖前端应用开发，优化用户体验，提升页面性能',
    location: '北京',
    jobType: 'full-time',
    experienceLevel: 'senior',
    salaryRange: [35000, 55000],
    remote: true,
    requirements: {
      skills: ['React', 'TypeScript', 'Webpack', 'Node.js'],
      experience: '5年以上前端开发经验',
      education: '本科及以上学历'
    }
  },
  {
    title: '数据科学家',
    company: '滴滴出行',
    description: '分析用户行为数据，构建机器学习模型，优化业务决策',
    location: '上海',
    jobType: 'full-time',
    experienceLevel: 'senior',
    salaryRange: [40000, 70000],
    remote: false,
    requirements: {
      skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
      experience: '3年以上数据科学经验',
      education: '硕士及以上学历，统计学/计算机相关专业'
    }
  },
  {
    title: 'DevOps工程师',
    company: '京东',
    description: '负责CI/CD流程设计，容器化部署，监控系统建设',
    location: '北京',
    jobType: 'full-time',
    experienceLevel: 'mid',
    salaryRange: [28000, 45000],
    remote: true,
    requirements: {
      skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS'],
      experience: '3-5年DevOps经验',
      education: '本科及以上学历'
    }
  }
]

async function seedData() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ai_resume_agent'
  })

  try {
    console.log('🌱 开始种子数据填充...')
    
    // 清空现有数据
    await pool.query('TRUNCATE TABLE jobs RESTART IDENTITY CASCADE')
    
    // 插入示例职位
    for (const job of sampleJobs) {
      await pool.query(`
        INSERT INTO jobs (title, company, description, location, job_type, experience_level, salary_range, remote, requirements)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        job.title,
        job.company, 
        job.description,
        job.location,
        job.jobType,
        job.experienceLevel,
        job.salaryRange,
        job.remote,
        JSON.stringify(job.requirements)
      ])
    }
    
    console.log(`✅ 已插入 ${sampleJobs.length} 个职位数据`)
    
  } catch (error) {
    console.error('❌ 种子数据填充失败:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

seedData()
