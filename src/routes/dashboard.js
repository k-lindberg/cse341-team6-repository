import { Router } from 'express';
import { dashboardPage } from '../controllers/dashboard.js';

const router = Router();

router.get('/', dashboardPage);

export default router;