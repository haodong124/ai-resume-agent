// scripts/migrate.js
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ai_resume_agent'
  })

  try {
    console.log('🔄 开始数据库迁移...')
    
    // 读取迁移文件
    const migrationPath = path.join(__dirname, '../migrations/001_create_tables.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // 执行迁移
    await pool.query(migrationSQL)
    
    console.log('✅ 数据库迁移完成')
  } catch (error) {
    console.error('❌ 迁移失败:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runMigrations()
