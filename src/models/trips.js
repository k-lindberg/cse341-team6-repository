// src/models/trips.js
import trip from "./schemas/trips.js";
import { getDb } from "../db/connect.js";

export async function getTripById(id) {
  return trip.findOne({ id }).lean();
}

export async function getAllTrips(filter = {}) {
  return trip.find(filter).lean();
}

export async function getTripFilterOptions() {
  const [regions, seasons] = await Promise.all([
    trip.distinct("region"),
    trip.distinct("bestSeason"),
  ]);
  return { regions, seasons };
}

export async function getSchedulesByTripId(tripId) {
  const db = getDb();
  return db.collection("schedules").find({ tripId }).toArray();
}
