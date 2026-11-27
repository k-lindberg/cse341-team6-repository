import { Router } from 'express';
import { bookingsAdminPage } from '../controllers/bookings.js';

const router = Router();

/**
 * @openapi
 * /bookings-admin:
 *   get:
 *    summary: Render the bookings admin page
 *   tags: [Bookings]
 *  responses:
 *    200:
 *    description: Bookings admin page rendered successfully
 *   content:
 *    text/html:
 *    schema:
 *     type: string
 *   500:
 *  description: Unable to render bookings admin page
 * content:
 *  text/html:
 *   schema:
 *    type: string
 */
router.get('/bookings-admin', bookingsAdminPage);

export default router;