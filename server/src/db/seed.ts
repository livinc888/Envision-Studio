import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDB } from './database.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { Counter, setSequence } from '../models/Counter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface MockProject {
  id: number;
  title: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold';
  deadline: string;
}

interface MockTask {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

interface MockData {
  projects: MockProject[];
  tasks: MockTask[];
}

export async function seedData(force = false): Promise<void> {
  await connectDB();

  const count = await Project.countDocuments();
  if (count > 0 && !force) {
    return;
  }

  const possiblePaths = [
    path.resolve(__dirname, '../../../data/mock.json'),
    path.resolve(__dirname, '../../data/mock.json'),
    path.resolve(process.cwd(), 'data/mock.json'),
    path.resolve(process.cwd(), '../data/mock.json')
  ];

  const mockPath = possiblePaths.find((p) => fs.existsSync(p));
  if (!mockPath) {
    throw new Error(`mock.json not found in any expected location: ${possiblePaths.join(', ')}`);
  }

  const fileContent = fs.readFileSync(mockPath, 'utf8');
  const data: MockData = JSON.parse(fileContent);

  if (force) {
    await Task.deleteMany({});
    await Project.deleteMany({});
    await Counter.deleteMany({});
  }

  let maxProjectId = 0;
  let maxTaskId = 0;

  for (const p of data.projects) {
    maxProjectId = Math.max(maxProjectId, p.id);
    await Project.findOneAndUpdate(
      { id: p.id },
      {
        id: p.id,
        title: p.title,
        description: p.description,
        status: p.status,
        deadline: p.deadline
      },
      { upsert: true, new: true }
    );
  }

  for (const t of data.tasks) {
    maxTaskId = Math.max(maxTaskId, t.id);
    const isCompleted = t.status === 'Completed';
    await Task.findOneAndUpdate(
      { id: t.id },
      {
        id: t.id,
        projectId: t.projectId,
        title: t.title,
        description: t.description || '',
        status: t.status || 'Pending',
        completed: isCompleted
      },
      { upsert: true, new: true }
    );
  }

  // Set sequence counters for subsequent atomic auto-increments
  await setSequence('projectId', maxProjectId);
  await setSequence('taskId', maxTaskId);

  console.log(`[Seed MongoDB] Seeded ${data.projects.length} projects and ${data.tasks.length} tasks successfully.`);
}

// Check if run directly
if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  seedData(true)
    .then(() => {
      console.log('[Seed MongoDB] Complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed MongoDB] Error:', err);
      process.exit(1);
    });
}
