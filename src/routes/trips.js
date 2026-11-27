// src/routes/trips.js
import { Router } from "express";
import { bookingPage, processBookingRequest } from "./book.js";
import confirmationPage from "./confirm.js";

const router = Router();

// Booking routes (owned by Feature Set 3 teammate)
router.get("/booking/:scheduleId", bookingPage);
router.post("/book", processBookingRequest);

// Confirmation page
router.get("/confirmation/:confirmationId", confirmationPage);

export default router;
