import { Router } from 'express';
import ejsRoutes from './ejs-routes.js';
import apiRoutes from './api-routes.js';

const router = Router();

// Website routes (EJS pages)
router.use('/', ejsRoutes);

// JSON API routes
router.use('/api', apiRoutes);

export default router;