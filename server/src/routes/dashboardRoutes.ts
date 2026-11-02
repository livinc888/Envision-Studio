import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController.js';

const router = Router();

router.get('/summary', (req, res, next) => dashboardController.getSummary(req, res, next));

export default router;

