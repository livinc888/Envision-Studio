import type { Request, Response, NextFunction } from 'express';
import { projectsService } from '../services/projectsService.js';
import { createProjectSchema, updateProjectSchema, projectQuerySchema } from '../validators/schemas.js';

export class ProjectsController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsedQuery = projectQuerySchema.parse(req.query);
      const projects = await projectsService.getAll(parsedQuery.status);
      res.json(projects);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid project ID format' });
        return;
      }

      const project = await projectsService.getById(id);
      if (!project) {
        res.status(404).json({ error: `Project with ID ${id} not found` });
        return;
      }

      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createProjectSchema.parse(req.body);
      const newProject = await projectsService.create(validated);
      res.status(201).json(newProject);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid project ID format' });
        return;
      }

      const validated = updateProjectSchema.parse(req.body);
      const updated = await projectsService.update(id, validated);
      if (!updated) {
        res.status(404).json({ error: `Project with ID ${id} not found` });
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
        res.status(400).json({ error: 'Invalid project ID format' });
        return;
      }

      const deleted = await projectsService.delete(id);
      if (!deleted) {
        res.status(404).json({ error: `Project with ID ${id} not found` });
        return;
      }

      res.json({ success: true, message: `Project ${id} deleted successfully` });
    } catch (error) {
      next(error);
    }
  }
}

export const projectsController = new ProjectsController();
