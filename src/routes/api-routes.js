import { Router } from 'express';
import { getAllBookings } from '../controllers/bookings.js';

const router = Router();

/**
 * @openapi
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: A list of bookings  
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Unable to retrieve bookings
 *          content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 */
router.get('/bookings', getAllBookings);

export default router;