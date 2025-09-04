#!/usr/bin/env python3
"""
Indeed 职位爬虫脚本
定时爬取指定条件的职位信息并存入 Supabase
"""

import os
import sys
import json
import time
import re
from datetime import datetime
from typing import List, Dict, Optional
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class IndeedScraper:
    """Indeed 职位爬虫"""
    
    def __init__(self, supabase_url: str, supabase_key: str):
        """初始化爬虫
        
        Args:
            supabase_url: Supabase 项目 URL
            supabase_key: Supabase service_role key (用于后端操作)
        """
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        }
        self.base_url = "https://au.indeed.com"  # 澳洲 Indeed
        
    def search_jobs(self, job_title: str, location: str, salary_min: Optional[int] = None) -> List[Dict]:
        """搜索职位
        
        Args:
            job_title: 职位名称
            location: 地点
            salary_min: 最低薪资要求（年薪）
            
        Returns:
            职位信息列表
        """
        jobs = []
        
        # 构建搜索 URL
        params = {
            'q': job_title,
            'l': location,
            'sort': 'date',  # 按日期排序
            'fromage': '7',  # 只获取最近7天的职位
        }
        
        if salary_min:
            params['salary'] = f'${salary_min}+'
            
        try:
            # 爬取第一页（MVP 版本只爬一页）
            url = f"{self.base_url}/jobs"
            response = requests.get(url, params=params, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 解析职位卡片
            job_cards = soup.find_all('div', class_='job_seen_beacon') or \
                       soup.find_all('div', class_='jobsearch-SerpJobCard') or \
                       soup.find_all('div', {'data-testid': 'job-card'})
            
            logger.info(f"找到 {len(job_cards)} 个职位")
            
            for card in job_cards[:20]:  # 限制最多20个，避免过多
                job = self._parse_job_card(card)
                if job:
                    jobs.append(job)
                    
            logger.info(f"成功解析 {len(jobs)} 个职位")
            
        except requests.RequestException as e:
            logger.error(f"请求失败: {e}")
        except Exception as e:
            logger.error(f"解析失败: {e}")
            
        return jobs
    
    def _parse_job_card(self, card) -> Optional[Dict]:
        """解析单个职位卡片
        
        Args:
            card: BeautifulSoup 职位卡片元素
            
        Returns:
            职位信息字典
        """
        try:
            # 职位标题和链接
            title_elem = card.find('h2', class_='jobTitle') or \
                        card.find('a', {'data-testid': 'job-title'}) or \
                        card.find('span', {'title': True})
            
            if not title_elem:
                return None
                
            title = title_elem.get_text(strip=True)
            
            # 获取职位链接
            link_elem = card.find('a', {'data-testid': 'job-title'}) or \
                       card.find('a', class_='jcs-JobTitle')
            job_url = self.base_url + link_elem['href'] if link_elem and 'href' in link_elem.attrs else None
            
            # 公司名称
            company_elem = card.find('span', {'data-testid': 'company-name'}) or \
                          card.find('span', class_='companyName') or \
                          card.find('div', class_='companyName')
            company = company_elem.get_text(strip=True) if company_elem else 'Unknown'
            
            # 地点
            location_elem = card.find('div', {'data-testid': 'job-location'}) or \
                           card.find('span', class_='locationsContainer') or \
                           card.find('div', class_='companyLocation')
            location = location_elem.get_text(strip=True) if location_elem else 'Unknown'
            
            # 薪资
            salary_elem = card.find('div', class_='salary-snippet') or \
                         card.find('span', class_='salary-snippet')
            salary_text = salary_elem.get_text(strip=True) if salary_elem else None
            salary_min, salary_max = self._parse_salary(salary_text)
            
            # 职位描述片段
            desc_elem = card.find('div', class_='job-snippet') or \
                       card.find('div', {'class': 'summary'})
            description = desc_elem.get_text(strip=True) if desc_elem else ''
            
            # 提取技能关键词
            skills = self._extract_skills(title + ' ' + description)
            
            return {
                'title': title,
                'company': company,
                'location': location,
                'salary_min': salary_min,
                'salary_max': salary_max,
                'salary_text': salary_text,
                'description': description[:500],  # 限制长度
                'job_url': job_url or f"{self.base_url}/jobs?q={title}",
                'skills': skills,
                'source': 'indeed',
                'posted_date': datetime.utcnow().isoformat(),
            }
            
        except Exception as e:
            logger.error(f"解析职位卡片失败: {e}")
            return None
    
    def _parse_salary(self, salary_text: Optional[str]) -> tuple:
        """解析薪资文本
        
        Args:
            salary_text: 薪资文本，如 "$80,000 - $100,000 a year"
            
        Returns:
            (salary_min, salary_max) 元组
        """
        if not salary_text:
            return (None, None)
            
        # 提取数字
        numbers = re.findall(r'\$?([\d,]+)', salary_text)
        if not numbers:
            return (None, None)
            
        # 转换为整数
        numbers = [int(n.replace(',', '')) for n in numbers]
        
        # 处理年薪/时薪
        if 'hour' in salary_text.lower():
            # 时薪转年薪（按 40小时/周，52周/年）
            numbers = [n * 40 * 52 for n in numbers]
        elif 'month' in salary_text.lower():
            # 月薪转年薪
            numbers = [n * 12 for n in numbers]
            
        if len(numbers) >= 2:
            return (numbers[0], numbers[1])
        elif len(numbers) == 1:
            return (numbers[0], None)
        else:
            return (None, None)
    
    def _extract_skills(self, text: str) -> List[str]:
        """从文本中提取技能关键词
        
        Args:
            text: 职位标题和描述文本
            
        Returns:
            技能列表
        """
        # 常见技能关键词（可扩展）
        skill_keywords = [
            'python', 'java', 'javascript', 'react', 'vue', 'angular', 'node.js',
            'sql', 'mongodb', 'postgresql', 'mysql', 'redis',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes',
            'machine learning', 'ai', 'data science', 'analytics',
            'agile', 'scrum', 'git', 'ci/cd', 'devops',
            'html', 'css', 'typescript', 'golang', 'rust',
            'project management', 'communication', 'leadership'
        ]
        
        text_lower = text.lower()
        found_skills = []
        
        for skill in skill_keywords:
            if skill in text_lower:
                found_skills.append(skill)
                
        return found_skills[:5]  # 最多返回5个技能
    
    def save_to_supabase(self, jobs: List[Dict]) -> int:
        """保存职位到 Supabase
        
        Args:
            jobs: 职位信息列表
            
        Returns:
            成功保存的数量
        """
        saved_count = 0
        
        for job in jobs:
            try:
                # 检查是否已存在（通过 job_url）
                existing = self.supabase.table('job_listings')\
                    .select('id')\
                    .eq('job_url', job['job_url'])\
                    .execute()
                
                if not existing.data:
                    # 插入新职位
                    result = self.supabase.table('job_listings')\
                        .insert(job)\
                        .execute()
                    
                    if result.data:
                        saved_count += 1
                        logger.info(f"保存职位: {job['title']} at {job['company']}")
                else:
                    # 更新现有职位
                    self.supabase.table('job_listings')\
                        .update({'scraped_at': datetime.utcnow().isoformat()})\
                        .eq('job_url', job['job_url'])\
                        .execute()
                    logger.info(f"职位已存在，更新时间: {job['title']}")
                    
            except Exception as e:
                logger.error(f"保存职位失败: {e}")
                
        return saved_count
    
    def clean_old_jobs(self, days: int = 30):
        """清理旧职位
        
        Args:
            days: 保留最近多少天的职位
        """
        try:
            # 将超过指定天数的职位标记为非活跃
            cutoff_date = datetime.utcnow().timestamp() - (days * 24 * 60 * 60)
            
            self.supabase.table('job_listings')\
                .update({'is_active': False})\
                .lt('scraped_at', datetime.fromtimestamp(cutoff_date).isoformat())\
                .execute()
                
            logger.info(f"清理了 {days} 天前的职位")
            
        except Exception as e:
            logger.error(f"清理失败: {e}")


def main():
    """主函数 - GitHub Actions 调用入口"""
    
    # 从环境变量获取配置
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_SERVICE_KEY')  # 注意：使用 service_role key
    
    if not supabase_url or not supabase_key:
        logger.error("缺少 SUPABASE_URL 或 SUPABASE_SERVICE_KEY 环境变量")
        sys.exit(1)
    
    # 获取爬取参数（可以从环境变量或配置文件读取）
    job_searches = [
        {'title': 'Software Engineer', 'location': 'Brisbane', 'salary_min': 80000},
        {'title': 'Frontend Developer', 'location': 'Brisbane', 'salary_min': 70000},
        {'title': 'Full Stack Developer', 'location': 'Brisbane', 'salary_min': 75000},
        {'title': 'React Developer', 'location': 'Brisbane', 'salary_min': 70000},
    ]
    
    # 初始化爬虫
    scraper = IndeedScraper(supabase_url, supabase_key)
    
    total_saved = 0
    
    # 执行爬取
    for search in job_searches:
        logger.info(f"开始爬取: {search}")
        
        jobs = scraper.search_jobs(
            job_title=search['title'],
            location=search['location'],
            salary_min=search.get('salary_min')
        )
        
        if jobs:
            saved = scraper.save_to_supabase(jobs)
            total_saved += saved
            
        # 避免请求过快
        time.sleep(5)
    
    # 清理旧数据
    scraper.clean_old_jobs(30)
    
    logger.info(f"爬取完成！共保存 {total_saved} 个新职位")
    

if __name__ == "__main__":
    main()
