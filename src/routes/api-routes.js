import { Router } from 'express';
import { getAllBookings, getMyBookings } from '../controllers/bookings.js';

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

/**
 * @openapi
 * /bookings/my:    
 *  get:
 *   summary: Get bookings for the logged-in user
 *  tags: [Bookings]
 *  responses:
 *    200:
 *    description: A list of bookings for the logged-in user
 *   content:
 *    application/json:
 *    schema:
 *    type: array
 *  items:
 *    $ref: '#/components/schemas/Booking'
 *   401:
 *  description: Unauthorized - User not logged in
 *  content:
 *  application/json:
 *   schema:
 *  type: object
 * properties:
 * error:
 * type: string
 *  500:
 * description: Unable to retrieve bookings for the logged-in user
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 */
router.get('/bookings/me', getMyBookings);

export default router;