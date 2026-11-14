
import mongoose from "mongoose";
import schedule from "./schemas/schedules.js";

export async function getSchedulesByTripId(tripId, month) {
    const schedules = await schedule
        .find({ tripId })
        .sort({ departureTime: 1 })
        .lean();

    // Without a month filter, return all schedules for this trip.
    if (month === undefined) {
        return schedules;
    }

    // Check the months when this trip operates.
    const trip = await mongoose.connection
        .collection("trips")
        .findOne(
            { id: tripId },
            { projection: { operatingMonths: 1 } }
        );

    if (!trip || !trip.operatingMonths?.includes(Number(month))) {
        return [];
    }

    return schedules;
}
