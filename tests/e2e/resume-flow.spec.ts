import { test, expect } from '@playwright/test'

test.describe('Resume Creation Flow', () => {
  test('should complete full resume creation flow', async ({ page }) => {
    // Navigate to landing page
    await page.goto('http://localhost:3000')
    
    // Click start button
    await page.click('text=开始制作')
    
    // Fill personal information
    await page.fill('input[name="name"]', '张三')
    await page.fill('input[name="email"]', 'zhangsan@example.com')
    await page.fill('input[name="phone"]', '13800138000')
    await page.fill('input[name="location"]', '北京')
    
    // Add education
    await page.click('text=添加教育经历')
    await page.fill('input[name="school"]', '清华大学')
    await page.fill('input[name="degree"]', '本科')
    await page.fill('input[name="major"]', '计算机科学')
    
    // Add experience
    await page.click('text=添加工作经历')
    await page.fill('input[name="company"]', '科技公司')
    await page.fill('input[name="position"]', '软件工程师')
    await page.fill('textarea[name="description"]', '负责开发和维护公司核心产品')
    
    // Navigate to skill recommendation
    await page.click('text=下一步')
    
    // Wait for AI recommendations
    await page.waitForSelector('text=推荐技能', { timeout: 10000 })
    
    // Select some skills
    await page.click('input[type="checkbox"]', { clickCount: 3 })
    
    // Continue to template selection
    await page.click('text=选择模板')
    
    // Select a template
    await page.click('.template-card:first-child')
    
    // Go to editor
    await page.click('text=开始编辑')
    
    // Verify editor loaded
    await expect(page.locator('.resume-preview')).toBeVisible()
    
    // Test export
    await page.click('text=导出PDF')
    
    // Verify export dialog or success message
    await expect(page.locator('text=导出成功')).toBeVisible({ timeout: 10000 })
  })
  
  test('should save and restore resume data', async ({ page }) => {
    // Create a resume
    await page.goto('http://localhost:3000/editor')
    
    // Add some data
    await page.fill('input[name="name"]', 'Test User')
    
    // Refresh page
    await page.reload()
    
    // Check data persisted
    const nameInput = await page.inputValue('input[name="name"]')
    expect(nameInput).toBe('Test User')
  })
})
