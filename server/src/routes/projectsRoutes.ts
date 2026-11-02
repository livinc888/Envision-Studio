import { Router } from 'express';
import { projectsController } from '../controllers/projectsController.js';
import { tasksController } from '../controllers/tasksController.js';

const router = Router();

// Project routes
router.get('/', (req, res, next) => projectsController.getAll(req, res, next));
router.post('/', (req, res, next) => projectsController.create(req, res, next));
router.get('/:id', (req, res, next) => projectsController.getById(req, res, next));
router.put('/:id', (req, res, next) => projectsController.update(req, res, next));
router.delete('/:id', (req, res, next) => projectsController.delete(req, res, next));

// Nested task routes for a project
router.get('/:projectId/tasks', (req, res, next) => tasksController.getByProjectId(req, res, next));
router.post('/:projectId/tasks', (req, res, next) => tasksController.create(req, res, next));

export default router;

