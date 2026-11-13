
import { Router } from "express";
import { getSchedulesForTrip } from "../controllers/schedules.js";

const router = Router();

/**
 * @openapi
 * /api/trips/{id}/schedules:
 *   get:
 *     summary: Get schedules for a trip
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the trip
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filter schedules by the month when the trip operates
 *     responses:
 *       200:
 *         description: A list of schedules for the requested trip
 *       400:
 *         description: Invalid month parameter
 *       500:
 *         description: Unable to retrieve schedules
 */
router.get("/trips/:id/schedules", getSchedulesForTrip);

export default router;
