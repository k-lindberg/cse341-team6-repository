import Station from './schemas/stations.js';

export async function getAllStations() {
    return Station.find({}).sort({ name: 1 }).lean();
}

export async function getStationById(id) {
    return Station.findOne({ id }).lean();
}