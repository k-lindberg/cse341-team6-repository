import railTripsRouter from "./trips.js";
import { trainsApi, trainsPage } from "./trains.js";
import { ticketClassesApi, ticketClassesPage } from "./ticket-classes.js";
import authRouter from "./auth.js";
import adminRouter from "./admin.js";
import tripApiRouter from "./trip-api.js"; // <-- NEW IMPORT
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

// Rail trips
router.use("/trips", railTripsRouter);

// Trips API <-- NEW ROUTE
router.use("/api/trips", tripApiRouter);

// Test 500 error page
router.get("/500", testErrorPage);

export default router;