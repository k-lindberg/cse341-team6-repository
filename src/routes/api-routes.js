// src/routes/api-routes.js
import { Router } from "express";
import { getAllTripsApi, getTripByIdApi } from "../controllers/trips.js";

const router = Router();

// ===== TRIPS API =====

/**
 * @openapi
 * /api/trips:
 *   get:
 *     summary: Get all trips
 *     tags: [Trips]
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Optional region filter
 *       - in: query
 *         name: season
 *         schema:
 *           type: string
 *         description: Optional best-season filter
 *     responses:
 *       200:
 *         description: A list of trips
 *       500:
 *         description: Unable to retrieve trips
 */
router.get("/trips", getAllTripsApi);

/**
 * @openapi
 * /api/trips/{id}:
 *   get:
 *     summary: Get a trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single trip
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Unable to retrieve trip
 */
router.get("/trips/:id", getTripByIdApi);

export default router;
