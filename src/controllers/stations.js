import {
    getAllStations as findAllStations,
    getStationById as findStationById,
} from '../models/stations.js';

// GET /api/stations
export const getAllStations = async (req, res) => {
    try {
        const stations = await findAllStations();
        return res.status(200).json({ stations });
    } catch (error) {
        console.error('Error loading stations:', error);
        return res.status(500).json({ error: 'Unable to load stations.' });
    }
};

// GET /api/stations/:id
export const getStationById = async (req, res) => {
    try {
        // Station ids are stored in lowercase (e.g. "nagoya").
        const id = req.params.id.trim().toLowerCase();
        const station = await findStationById(id);

        if (!station) {
            return res.status(404).json({ error: 'Station not found.' });
        }

        return res.status(200).json({ station });
    } catch (error) {
        console.error('Error loading station:', error);
        return res.status(500).json({ error: 'Unable to load station.' });
    }
};