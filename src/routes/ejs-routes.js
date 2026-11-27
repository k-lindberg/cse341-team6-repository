// src/routes/ejs-routes.js
import { Router } from "express";
import { listTripsPage, tripDetailsPage } from "../controllers/trips.js";
import railTripsRouter from "./trips.js";

const router = Router();

// Mount the trips router FIRST so specific routes like /trips/book
// are handled before the dynamic /trips/:id route.
router.use("/trips", railTripsRouter);

// Trips EJS Pages
router.get("/trips", listTripsPage);
router.get("/trips/:id", tripDetailsPage);

export default router;
