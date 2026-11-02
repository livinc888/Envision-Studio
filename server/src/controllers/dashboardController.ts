import type { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboardService.js';

export class DashboardController {
  async getSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await dashboardService.getSummary();
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
