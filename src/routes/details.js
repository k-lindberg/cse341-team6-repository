
import { getDb } from '../db/connect.js';

export default async (req, res) => {
    try {
        const { tripId } = req.params;
        const db = getDb();

        const details = await db.collection('trips').findOne({ id: tripId });

        if (!details) {
            return res.status(404).send('Trip not found');
        }

        return res.render('trips/details', {
            title: 'Trip Details',
            details
        });
    } catch (error) {
        console.error('Error loading trip details:', error);
        return res.status(500).send('Unable to load trip details');
    }
};
