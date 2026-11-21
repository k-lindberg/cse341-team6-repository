// src/routes/ejs-routes.js
import { Router } from "express";
import { listTripsPage, tripDetailsPage } from "../controllers/trips.js";
import railTripsRouter from "./trips.js"; // <-- Import the trips router (adjust path if needed)

const router = Router();

// 1. Mount the trips router FIRST so specific routes like /trips/book
// are handled before the dynamic /trips/:tripId route.
router.use("/trips", railTripsRouter);

// 2. Trips EJS Pages
router.get("/trips", listTripsPage);
router.get("/trips/:tripId", tripDetailsPage);

// Note: Other teammates will add their EJS page routes here later

export default router;
