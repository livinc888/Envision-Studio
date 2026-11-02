import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { getNextSequence } from '../models/Counter.js';
import type { CreateTaskInput, UpdateTaskInput } from '../validators/schemas.js';
import type { TaskRecord } from './projectsService.js';

export class TasksService {
  async getByProjectId(projectId: number): Promise<TaskRecord[]> {
    const rows = await Task.find({ projectId }).sort({ id: 1 }).lean();
    return rows.map((t: any) => ({
      id: t.id,
      projectId: t.projectId,
      title: t.title,
      description: t.description || '',
      status: t.status,
      completed: Boolean(t.completed || t.status === 'Completed'),
      createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt || new Date().toISOString()),
      updatedAt: t.updatedAt instanceof Date ? t.updatedAt.toISOString() : String(t.updatedAt || new Date().toISOString())
    }));
  }

  async create(projectId: number, data: CreateTaskInput): Promise<TaskRecord | null> {
    // Check if project exists first
    const projectExists = await Project.findOne({ id: projectId }).lean();
    if (!projectExists) return null;

    let status = data.status || 'Pending';
    let isCompleted = false;

    if (data.completed !== undefined) {
      isCompleted = Boolean(data.completed);
      status = data.completed ? 'Completed' : (status === 'Completed' ? 'Pending' : status);
    } else if (status === 'Completed') {
      isCompleted = true;
    }

    const newId = await getNextSequence('taskId');
    const newTask = await Task.create({
      id: newId,
      projectId,
      title: data.title,
      description: data.description || '',
      status,
      completed: isCompleted
    });

    return {
      id: newId,
      projectId,
      title: data.title,
      description: data.description || '',
      status,
      completed: isCompleted,
      createdAt: newTask.createdAt ? newTask.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: newTask.updatedAt ? newTask.updatedAt.toISOString() : new Date().toISOString()
    };
  }

  async update(id: number, data: UpdateTaskInput): Promise<TaskRecord | null> {
    const existing = await Task.findOne({ id });
    if (!existing) return null;

    if (data.title !== undefined) existing.title = data.title;
    if (data.description !== undefined) existing.description = data.description;

    if (data.status !== undefined) {
      existing.status = data.status;
      existing.completed = data.status === 'Completed';
    }

    if (data.completed !== undefined) {
      existing.completed = Boolean(data.completed);
      if (data.completed) {
        existing.status = 'Completed';
      } else if (existing.status === 'Completed') {
        existing.status = 'Pending';
      }
    }

    await existing.save();

    return {
      id: existing.id,
      projectId: existing.projectId,
      title: existing.title,
      description: existing.description || '',
      status: existing.status,
      completed: Boolean(existing.completed),
      createdAt: existing.createdAt ? existing.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: existing.updatedAt ? existing.updatedAt.toISOString() : new Date().toISOString()
    };
  }

  async delete(id: number): Promise<boolean> {
    const result = await Task.findOneAndDelete({ id });
    return Boolean(result);
  }
}

export const tasksService = new TasksService();
