import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up to 10 users
    { duration: '1m', target: 10 },   // Stay at 10 users
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    errors: ['rate<0.1'],              // Error rate must be below 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8888/.netlify/functions';

export default function () {
  // Test resume analysis endpoint
  const analyzePayload = JSON.stringify({
    resume: {
      personalInfo: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        location: 'Beijing',
      },
      experience: [
        {
          id: '1',
          company: 'Test Company',
          position: 'Software Engineer',
          duration: '2020-2023',
          description: 'Developed web applications',
        },
      ],
      education: [],
      projects: [],
      skills: [],
    },
  });

  const analyzeResponse = http.post(
    `${BASE_URL}/ai/analyze`,
    analyzePayload,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(analyzeResponse, {
    'analyze status is 200': (r) => r.status === 200,
    'analyze response has success': (r) => {
      const body = JSON.parse(r.body);
      return body.success === true;
    },
  });

  errorRate.add(analyzeResponse.status !== 200);

  sleep(1);

  // Test job matching endpoint
  const matchPayload = JSON.stringify({
    resume: {
      personalInfo: { name: 'Test User' },
      skills: [
        { id: '1', name: 'JavaScript', level: 'expert', category: 'Programming' },
      ],
    },
    job: 'Looking for a JavaScript developer with React experience',
  });

  const matchResponse = http.post(
    `${BASE_URL}/ai/match-jobs`,
    matchPayload,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(matchResponse, {
    'match status is 200': (r) => r.status === 200,
    'match response has score': (r) => {
      const body = JSON.parse(r.body);
      return typeof body.score === 'number';
    },
  });

  errorRate.add(matchResponse.status !== 200);

  sleep(1);
}
