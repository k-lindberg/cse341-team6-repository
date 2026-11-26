import railTripsRouter from "./trips.js";
import { trainsApi, trainsPage } from "./trains.js";
import { ticketClassesApi, ticketClassesPage } from "./ticket-classes.js";
import { getAllStations, getStationById } from "../controllers/stations.js";
import authRouter from "./auth.js";
import adminRouter from "./admin.js";
import { Router } from "express";
import { homePage, aboutPage, testErrorPage } from "./index.js";

const router = Router();

// Home page
router.get("/", homePage);

// About page
router.get("/about", aboutPage);

// Trains page
router.get("/trains", trainsPage);

// Trains API
router.get("/api/trains", trainsApi);

// Auth (register/login/logout)
router.use("/", authRouter);

// Admin (protected dashboard)
router.use("/admin", adminRouter);

// Ticket Classes page
router.get('/ticket-classes', ticketClassesPage);
router.get('/api/ticket-classes', ticketClassesApi);

// Stations API

/**
 * @swagger
 * /api/stations:
 *   get:
 *     summary: Get all stations
 *     tags: [Stations]
 *     responses:
 *       200:
 *         description: A list of all stations, sorted by name.
 *         content:
 *           application/json:
 *             example:
 *               stations:
 *                 - id: nagoya
 *                   name: Nagoya Station
 *                   prefecture: Aichi
 *                   region: central
 *                   facilities: [restaurant, shop, restroom]
 *                   description: Major transportation hub in central Japan.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             example:
 *               error: Unable to load stations.
 */
router.get("/api/stations", getAllStations);

/**
 * @swagger
 * /api/stations/{id}:
 *   get:
 *     summary: Get one station by its id
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The station id (case-insensitive), for example "nagoya".
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The station was found.
 *         content:
 *           application/json:
 *             example:
 *               station:
 *                 id: nagoya
 *                 name: Nagoya Station
 *                 prefecture: Aichi
 *                 region: central
 *                 facilities: [restaurant, shop, restroom]
 *                 description: Major transportation hub in central Japan.
 *       404:
 *         description: No station exists with that id.
 *         content:
 *           application/json:
 *             example:
 *               error: Station not found.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             example:
 *               error: Unable to load station.
 */
router.get("/api/stations/:id", getStationById);

// Rail trips
router.use("/trips", railTripsRouter);

// Test 500 error page
router.get("/500", testErrorPage);

export default router;
