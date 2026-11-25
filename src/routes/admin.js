import { Router } from "express";
import { requirePageRole } from "../middleware/auth.js";

const adminRouter = Router();

// Admin dashboard (protected)
adminRouter.get("/dashboard", requirePageRole("admin"), (req, res) => {
  res.render("admin-dashboard", { title: "Admin Dashboard" });
});

// NEW: Trip Admin Page (protected)
adminRouter.get("/trips", requirePageRole("admin"), (req, res) => {
  res.render("trip-admin", { title: "Trip Admin" });
});

export default adminRouter;