// src/controllers/trips.js
import {
  getTripById,
  getAllTrips,
  getTripFilterOptions,
  getSchedulesByTripId,
} from "../models/trips.js";

// ===== EJS PAGE CONTROLLERS =====

export const listTripsPage = async (req, res) => {
  try {
    const { regions, seasons } = await getTripFilterOptions();

    return res.render("trips/list", {
      title: "Scenic Train Trips",
      regions,
      seasons,
    });
  } catch (error) {
    console.error("Error rendering trips list page:", error.message);
    return res
      .status(500)
      .render("errors/500", {
        title: "Server Error",
        error: error.message,
        stack: "",
      });
  }
};

export const tripDetailsPage = async (req, res) => {
  try {
    const trip = await getTripById(req.params.id);
    if (!trip) {
      return res
        .status(404)
        .render("errors/404", {
          title: "Page Not Found",
          error: "Trip not found",
          stack: "",
        });
    }

    // NEW: load schedules so details.ejs can render booking options
    const schedules = await getSchedulesByTripId(trip.id);

    return res.render("trips/details", {
      title: "Trip Details",
      details: { ...trip, schedules },
    });
  } catch (error) {
    console.error("Error rendering trip details page:", error.message);
    return res
      .status(500)
      .render("errors/500", {
        title: "Server Error",
        error: error.message,
        stack: "",
      });
  }
};

// ===== API CONTROLLERS =====

export const getAllTripsApi = async (req, res) => {
  try {
    // NEW: build a filter from optional query params
    const filter = {};
    if (req.query.region) filter.region = req.query.region;
    if (req.query.season) filter.bestSeason = req.query.season;

    const trips = await getAllTrips(filter);
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
