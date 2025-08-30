import { describe, it, expect, beforeEach } from 'vitest'
import { RulePlanner } from '@ai-resume-agent/agent-core/src/planner/RulePlanner'
import { LLMRouter } from '@ai-resume-agent/agent-core/src/llm/router'

describe('RulePlanner', () => {
  let planner: RulePlanner
  let mockLLM: LLMRouter

  beforeEach(() => {
    mockLLM = new LLMRouter({ llm: 'mock' })
    planner = new RulePlanner(mockLLM)
  })

  it('should create a plan for resume analysis', async () => {
    const plan = await planner.plan('analyze_resume', {
      resume: { personalInfo: { name: 'Test User' } }
    })

    expect(plan).toBeDefined()
    expect(plan.steps).toBeInstanceOf(Array)
    expect(plan.steps.length).toBeGreaterThan(0)
    expect(plan.strategy).toMatch(/sequential|parallel|conditional/)
  })

  it('should create different plans for different intents', async () => {
    const analyzePlan = await planner.plan('analyze_resume', {})
    const optimizePlan = await planner.plan('optimize_content', {})

    expect(analyzePlan.steps[0].name).not.toBe(optimizePlan.steps[0].name)
  })

  it('should handle unknown intents gracefully', async () => {
    const plan = await planner.plan('unknown_intent', {})

    expect(plan).toBeDefined()
    expect(plan.steps.length).toBe(1)
    expect(plan.steps[0].name).toBe('Process request')
  })
})
