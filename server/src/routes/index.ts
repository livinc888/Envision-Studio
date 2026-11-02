import { Router } from 'express';
import projectsRoutes from './projectsRoutes.js';
import tasksRoutes from './tasksRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = Router();

router.use('/projects', projectsRoutes);
router.use('/tasks', tasksRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;

