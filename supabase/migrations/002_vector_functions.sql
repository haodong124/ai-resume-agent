-- supabase/migrations/002_vector_functions.sql

-- 向量搜索函数
CREATE OR REPLACE FUNCTION match_jobs_by_embedding(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  title varchar,
  company varchar,
  location varchar,
  salary_min integer,
  salary_max integer,
  description text,
  requirements jsonb,
  skills jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    jobs.id,
    jobs.title,
    jobs.company,
    jobs.location,
    jobs.salary_min,
    jobs.salary_max,
    jobs.description,
    jobs.requirements,
    jobs.skills,
    (jobs.embedding <#> query_embedding) * -1 AS similarity
  FROM jobs
  WHERE jobs.embedding <#> query_embedding < -match_threshold
  AND jobs.is_active = true
  ORDER BY jobs.embedding <#> query_embedding
  LIMIT match_count;
END;
$$;

-- 类似简历搜索函数
CREATE OR REPLACE FUNCTION match_resumes_by_job(
  job_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  title varchar,
  content jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    resumes.id,
    resumes.user_id,
    resumes.title,
    resumes.content,
    (resumes.embedding <#> job_embedding) * -1 AS similarity
  FROM resumes
  WHERE resumes.embedding <#> job_embedding < -match_threshold
  AND resumes.is_active = true
  ORDER BY resumes.embedding <#> job_embedding
  LIMIT match_count;
END;
$$;

-- 推荐性能分析函数
CREATE OR REPLACE FUNCTION analyze_recommendation_performance()
RETURNS TABLE (
  total_recommendations bigint,
  avg_match_score float,
  click_through_rate float,
  conversion_rate float,
  top_skills text[]
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_recommendations,
    AVG(match_score)::float as avg_match_score,
    (COUNT(*) FILTER (WHERE user_feedback IS NOT NULL))::float / COUNT(*)::float as click_through_rate,
    (COUNT(*) FILTER (WHERE user_feedback >= 4))::float / COUNT(*)::float as conversion_rate,
    ARRAY(
      SELECT jsonb_array_elements_text(skills) as skill
      FROM jobs 
      JOIN job_recommendations ON jobs.id = job_recommendations.job_id
      WHERE job_recommendations.created_at > NOW() - INTERVAL '30 days'
      GROUP BY skill
      ORDER BY COUNT(*) DESC
      LIMIT 10
    ) as top_skills
  FROM job_recommendations
  WHERE created_at > NOW() - INTERVAL '30 days';
END;
$$;
