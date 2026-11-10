// src/routes/ejs-routes.js
import { Router } from "express";
import { listTripsPage, tripDetailsPage } from "../controllers/trips.js";
// Note: Other teammates will add their EJS page routes here later

const router = Router();

// Trips EJS Pages
router.get("/trips", listTripsPage);
router.get("/trips/:tripId", tripDetailsPage);

export default router;
