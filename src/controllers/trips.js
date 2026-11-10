// src/controllers/trips.js
import { getTripById, getAllTrips } from "../models/trips.js";
import { getDb } from "../db/connect.js";

// ===== EJS PAGE CONTROLLERS =====

export const listTripsPage = async (req, res) => {
  try {
    const db = getDb();
    // Keep regions and seasons for filter dropdowns
    const [regions, seasons] = await Promise.all([
      db.collection("trips").distinct("region"),
      db.collection("trips").distinct("bestSeason"),
    ]);

    return res.render("trips/list", {
      title: "Scenic Train Trips",
      regions,
      seasons,
    });
  } catch (error) {
    console.error("Error rendering trips list page:", error.message);
    return res.status(500).render("errors/500");
  }
};

export const tripDetailsPage = async (req, res) => {
  try {
    const trip = await getTripById(req.params.tripId);
    if (!trip) {
      return res.status(404).render("errors/404");
    }
    return res.render("trips/details", {
      title: "Trip Details",
      details: trip,
    });
  } catch (error) {
    console.error("Error rendering trip details page:", error.message);
    return res.status(500).render("errors/500");
  }
};

// ===== API CONTROLLERS =====

export const getAllTripsApi = async (req, res) => {
  try {
    const trips = await getAllTrips();
    return res.status(200).json(trips);
  } catch (error) {
    console.error("Failed to retrieve trips:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getTripByIdApi = async (req, res) => {
  try {
    const trip = await getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    return res.status(200).json(trip);
  } catch (error) {
    console.error("Failed to retrieve trip:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
