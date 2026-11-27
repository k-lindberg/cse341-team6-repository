// src/routes/router.js
import { trainsApi, trainsPage } from "./trains.js";
import apiRoutes from "./api-routes.js";
import ejsRoutes from "./ejs-routes.js";
import railTripsRouter from "./trips.js";
import { ticketClassesApi, ticketClassesPage } from "./ticket-classes.js";
import authRouter from "./auth.js";
import adminRouter from "./admin.js";
import { Router } from "express";
import { homePage, aboutPage, testErrorPage } from "./index.js";
import usersRouter from "./users.js";

const router = Router();

// Home page
router.get("/", homePage);

// About page
router.get("/about", aboutPage);

// Trains page
router.get("/trains", trainsPage);

// Trains API
router.get("/api/trains", trainsApi);

// API routes (Trips, etc.)
router.use("/api", apiRoutes);

// EJS Page routes (Trips, etc.)
router.use("/", ejsRoutes);

// Auth (register/login/logout)
router.use("/", authRouter);

// Admin (protected dashboard)
router.use("/admin", adminRouter);

// Users routes (from your PR #17)
router.use("/users", usersRouter);

// Ticket Classes page (from main)
router.get('/ticket-classes', ticketClassesPage);
router.get('/api/ticket-classes', ticketClassesApi);

// Test 500 error page
router.get("/500", testErrorPage);

export default router;
