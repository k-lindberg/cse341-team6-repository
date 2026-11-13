
import { getSchedulesByTripId } from "../models/schedules.js";

export async function getSchedulesForTrip(req, res) {
    // If a month was supplied, use the month-filtered function.
    if (req.query.month !== undefined) {
        return getSchedulesForTripAndMonth(req, res);
    }

    try {
        const { id } = req.params;
        const schedules = await getSchedulesByTripId(id);

        return res.status(200).json(schedules);
    } catch (error) {
        console.error("Error fetching schedules:", error);

        return res.status(500).json({
            error: "Failed to fetch schedules",
        });
    }
}

export async function getSchedulesForTripAndMonth(req, res) {
    try {
        const { id } = req.params;
        const month = Number(req.query.month);

        if (
            req.query.month === "" ||
            !Number.isInteger(month) ||
            month < 1 ||
            month > 12
        ) {
            return res.status(400).json({
                error: "Month must be a number between 1 and 12",
            });
        }

        const schedules = await getSchedulesByTripId(id, month);

        return res.status(200).json(schedules);
    } catch (error) {
        console.error("Error fetching schedules by month:", error);

        return res.status(500).json({
            error: "Failed to fetch schedules",
        });
    }
}
