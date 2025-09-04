-- supabase/seed.sql
-- 插入示例职位数据

INSERT INTO jobs (title, company, location, salary_min, salary_max, description, requirements, skills) VALUES
('React前端开发工程师', '字节跳动', '北京', 25000, 45000, 
'负责字节跳动产品的前端开发工作，包括PC端和移动端网站的开发与维护。',
'{"experience": "3-5年", "education": "本科及以上", "requirements": ["熟练掌握React", "了解现代前端工程化", "有大型项目经验"]}',
'["JavaScript", "React", "TypeScript", "Webpack", "Git"]'),

('全栈开发工程师', '阿里巴巴', '杭州', 30000, 50000,
'负责电商平台的全栈开发，包括前端用户界面和后端API服务的设计与实现。',
'{"experience": "5-8年", "education": "本科及以上", "requirements": ["精通JavaScript/TypeScript", "熟悉Node.js", "了解云服务"]}',
'["JavaScript", "TypeScript", "React", "Node.js", "MongoDB", "AWS"]'),

('Vue.js前端开发', '腾讯', '深圳', 22000, 38000,
'参与腾讯产品的前端开发，主要使用Vue.js技术栈进行页面开发和交互实现。',
'{"experience": "2-4年", "education": "本科及以上", "requirements": ["熟练使用Vue.js", "掌握前端工程化工具", "有移动端开发经验"]}',
'["JavaScript", "Vue.js", "CSS3", "HTML5", "Vite", "Element UI"]'),

('Node.js后端开发', '美团', '北京', 28000, 42000,
'负责美团业务的后端服务开发，包括API设计、数据库优化和微服务架构。',
'{"experience": "3-6年", "education": "本科及以上", "requirements": ["精通Node.js", "熟悉数据库设计", "了解微服务架构"]}',
'["Node.js", "Express", "MySQL", "Redis", "Docker", "Kubernetes"]'),

('前端架构师', '滴滴', '北京', 40000, 70000,
'负责前端技术架构设计，制定技术规范，指导团队进行前端技术选型和架构优化。',
'{"experience": "8年以上", "education": "本科及以上", "requirements": ["丰富的前端架构经验", "团队管理能力", "技术前瞻性"]}',
'["JavaScript", "TypeScript", "React", "Vue.js", "Webpack", "微前端", "性能优化"]');

-- 插入示例面试问题
INSERT INTO interview_questions (job_type, difficulty_level, question_type, content, expected_points, time_limit) VALUES
('frontend', 'intermediate', 'technical', 
'请解释JavaScript的事件循环机制，并说明宏任务和微任务的执行顺序。',
'["事件循环基本概念", "调用栈执行", "任务队列机制", "宏任务微任务区别", "执行顺序举例"]',
300),

('frontend', 'intermediate', 'behavioral',
'描述一次你在项目中遇到的技术难题，你是如何分析和解决的？',
'["问题描述清晰", "分析思路合理", "解决方案可行", "结果量化", "经验总结"]',
420),

('backend', 'advanced', 'technical',
'设计一个高并发的秒杀系统，需要考虑哪些关键技术点？',
'["流量控制", "库存扣减", "数据一致性", "缓存策略", "限流熔断", "监控告警"]',
600),

('fullstack', 'advanced', 'situational',
'如果让你负责一个新产品的技术选型，你会从哪些维度来考虑？',
'["业务需求分析", "技术栈选择", "团队技能匹配", "性能要求", "扩展性考虑", "成本控制"]',
480);

-- 生成向量索引（需要预先计算embedding）
-- 这部分需要通过应用程序调用OpenAI API来生成
