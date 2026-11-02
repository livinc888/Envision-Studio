
import { Router } from 'express';
import { tasksController } from '../controllers/tasksController.js';

const router = Router();

router.put('/:id', (req, res, next) => tasksController.update(req, res, next));
router.delete('/:id', (req, res, next) => tasksController.delete(req, res, next));

export default router;
