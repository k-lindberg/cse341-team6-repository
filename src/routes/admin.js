import { Router } from "express";
import { requirePageRole } from "../middleware/auth.js";

const adminRouter = Router();

// Admin dashboard (protected)
adminRouter.get("/dashboard", requirePageRole("admin"), (req, res) => {
  res.render("admin-dashboard", { title: "Admin Dashboard" });
});

export default adminRouter;
