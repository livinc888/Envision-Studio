import type { Request, Response, NextFunction } from 'express';
import { tasksService } from '../services/tasksService.js';
import { createTaskSchema, updateTaskSchema } from '../validators/schemas.js';

export class TasksController {
  async getByProjectId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = parseInt(String(req.params.projectId), 10);
      if (isNaN(projectId)) {
        res.status(400).json({ error: 'Invalid project ID format' });
        return;
      }

      const tasks = await tasksService.getByProjectId(projectId);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = parseInt(String(req.params.projectId), 10);
      if (isNaN(projectId)) {
        res.status(400).json({ error: 'Invalid project ID format' });
        return;
      }

      const validated = createTaskSchema.parse(req.body);
      const newTask = await tasksService.create(projectId, validated);

      if (!newTask) {
        res.status(404).json({ error: `Project with ID ${projectId} not found` });
        return;
      }

      res.status(201).json(newTask);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid task ID format' });
        return;
      }

      const validated = updateTaskSchema.parse(req.body);
      const updated = await tasksService.update(id, validated);

      if (!updated) {
        res.status(404).json({ error: `Task with ID ${id} not found` });
        return;
      }

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid task ID format' });
        return;
      }

      const deleted = await tasksService.delete(id);
      if (!deleted) {
        res.status(404).json({ error: `Task with ID ${id} not found` });
        return;
      }

      res.json({ success: true, message: `Task ${id} deleted successfully` });
    } catch (error) {
      next(error);
    }
  }
}

export const tasksController = new TasksController();
