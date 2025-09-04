-- supabase/migrations/001_initial_schema.sql

-- 启用向量扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  profile JSONB DEFAULT '{}'::jsonb
);

-- 简历表
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL DEFAULT '我的简历',
  content JSONB NOT NULL,
  embedding VECTOR(1536),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 职位表
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  company VARCHAR NOT NULL,
  location VARCHAR,
  salary_min INTEGER,
  salary_max INTEGER,
  description TEXT,
  requirements JSONB,
  skills JSONB,
  embedding VECTOR(1536),
  source VARCHAR DEFAULT 'manual',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 推荐记录表
CREATE TABLE job_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  job_id UUID REFERENCES jobs(id),
  resume_id UUID REFERENCES resumes(id),
  match_score FLOAT NOT NULL,
  match_details JSONB,
  user_feedback INTEGER, -- 1-5评分
  created_at TIMESTAMP DEFAULT NOW()
);

-- 面试会话表
CREATE TABLE interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  job_type VARCHAR NOT NULL,
  difficulty_level VARCHAR DEFAULT 'intermediate',
  status VARCHAR DEFAULT 'active', -- active, completed, abandoned
  questions JSONB,
  current_question INTEGER DEFAULT 1,
  total_score FLOAT,
  feedback JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- 索引优化
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_embedding ON resumes USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_jobs_embedding ON jobs USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_recommendations_user_id ON job_recommendations(user_id);
