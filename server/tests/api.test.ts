import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/db/database.js';
import { seedData } from '../src/db/seed.js';

beforeAll(async () => {
  // Ensure database has clean seeded mock data before running tests
  await connectDB();
  await seedData(true);
});

afterAll(async () => {
  await disconnectDB();
});

describe('Projects API', () => {
  it('GET /api/projects returns all seeded projects with task stats', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(10);

    const first = res.body[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('title');
    expect(first).toHaveProperty('status');
    expect(first).toHaveProperty('deadline');
    expect(first).toHaveProperty('taskCount');
    expect(first).toHaveProperty('completedTaskCount');
    expect(first).toHaveProperty('progress');
  });

  it('GET /api/projects?status=Active filters properly', async () => {
    const res = await request(app).get('/api/projects?status=Active');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    for (const project of res.body) {
      expect(project.status).toBe('Active');
    }
  });

  it('GET /api/projects?status=Invalid returns 400 validation error', async () => {
    const res = await request(app).get('/api/projects?status=NonExistent');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('GET /api/projects/:id returns project details and tasks', async () => {
    const res = await request(app).get('/api/projects/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toBe('E-Commerce Website Redesign');
    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(res.body.tasks.length).toBe(3);
  });

  it('GET /api/projects/:id returns 404 for unknown project', async () => {
    const res = await request(app).get('/api/projects/9999');
    expect(res.status).toBe(404);
  });

  it('POST /api/projects creates a new project with validation', async () => {
    const newProj = {
      title: 'AI Portfolio Builder',
      description: 'Generative AI website builder for modern design agencies.',
      status: 'Active',
      deadline: '2026-12-01'
    };

    const res = await request(app).post('/api/projects').send(newProj);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(newProj.title);
    expect(res.body.status).toBe('Active');

    // Test validation failure
    const invalidRes = await request(app).post('/api/projects').send({
      title: 'A', // too short
      description: 'No'
    });
    expect(invalidRes.status).toBe(400);
    expect(invalidRes.body.error).toBe('Validation failed');
  });

  it('PUT /api/projects/:id updates project details', async () => {
    const res = await request(app).put('/api/projects/2').send({
      title: 'Updated Mobile App Fitness Tracker',
      status: 'Completed'
    });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Mobile App Fitness Tracker');
    expect(res.body.status).toBe('Completed');
  });

  it('PUT /api/projects/:id returns 404 for unknown project', async () => {
    const res = await request(app).put('/api/projects/9999').send({
      title: 'Ghost Project'
    });
    expect(res.status).toBe(404);
  });
});

describe('Tasks API', () => {
  it('GET /api/projects/:projectId/tasks returns tasks for a project', async () => {
    const res = await request(app).get('/api/projects/1/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(3);
    expect(res.body[0]).toHaveProperty('title');
    expect(res.body[0]).toHaveProperty('completed');
  });

  it('POST /api/projects/:projectId/tasks creates a task', async () => {
    const taskPayload = {
      title: 'QA Responsive Breakpoints',
      description: 'Test all components from 360px to 1920px.',
      status: 'Pending'
    };
    const res = await request(app).post('/api/projects/1/tasks').send(taskPayload);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(taskPayload.title);
    expect(res.body.projectId).toBe(1);
    expect(res.body.completed).toBe(false);
  });

  it('POST /api/projects/:projectId/tasks returns 404 for non-existent project', async () => {
    const res = await request(app).post('/api/projects/9999/tasks').send({
      title: 'Ghost task'
    });
    expect(res.status).toBe(404);
  });

  it('PUT /api/tasks/:id toggles completed state', async () => {
    const res = await request(app).put('/api/tasks/103').send({
      completed: true
    });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
    expect(res.body.status).toBe('Completed');

    // Toggle back
    const res2 = await request(app).put('/api/tasks/103').send({
      completed: false
    });
    expect(res2.status).toBe(200);
    expect(res2.body.completed).toBe(false);
  });

  it('DELETE /api/tasks/:id removes a task', async () => {
    // Create a temporary task first
    const createRes = await request(app).post('/api/projects/1/tasks').send({
      title: 'Task to be deleted'
    });
    const taskId = createRes.body.id;

    const deleteRes = await request(app).delete(`/api/tasks/${taskId}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    // Deleting again should return 404
    const repeatRes = await request(app).delete(`/api/tasks/${taskId}`);
    expect(repeatRes.status).toBe(404);
  });

  it('DELETE /api/projects/:id cascades to tasks', async () => {
    // Create a project with a task
    const projRes = await request(app).post('/api/projects').send({
      title: 'Cascade Delete Test Project',
      description: 'Will be deleted soon',
      status: 'On Hold',
      deadline: '2026-11-15'
    });
    const projId = projRes.body.id;

    const taskRes = await request(app).post(`/api/projects/${projId}/tasks`).send({
      title: 'Cascade Task'
    });
    const taskId = taskRes.body.id;

    // Delete project
    const delProjRes = await request(app).delete(`/api/projects/${projId}`);
    expect(delProjRes.status).toBe(200);

    // Verify task is deleted via cascade
    const getTaskRes = await request(app).put(`/api/tasks/${taskId}`).send({ title: 'New' });
    expect(getTaskRes.status).toBe(404);
  });
});

describe('Dashboard Summary API', () => {
  it('GET /api/dashboard/summary returns accurate aggregate metrics', async () => {
    const res = await request(app).get('/api/dashboard/summary');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalProjects');
    expect(res.body).toHaveProperty('activeProjects');
    expect(res.body).toHaveProperty('completedTasks');
    expect(res.body).toHaveProperty('pendingTasks');
    expect(res.body).toHaveProperty('totalTasks');
    expect(res.body).toHaveProperty('overallCompletionRate');
    expect(Array.isArray(res.body.upcomingDeadlines)).toBe(true);
    expect(Array.isArray(res.body.activeProjectsList)).toBe(true);

    expect(typeof res.body.totalProjects).toBe('number');
    expect(res.body.totalProjects).toBeGreaterThanOrEqual(10);
  });
});
