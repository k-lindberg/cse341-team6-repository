import { Router } from 'express';
import { getDb } from '../db/connect.js';
import { requireApiRole } from '../middleware/auth.js'; // <-- IMPORT THE GUARD

const router = Router();

// GET all trips
router.get('/', async (req, res) => {
    try {
        const trips = await getDb().collection('trips').find({}).toArray();
        res.json({ trips });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
});

// DELETE a trip (admin only)
router.delete('/:id', requireApiRole('admin'), async (req, res) => { // <-- SECURED ROUTE
    try {
        const db = getDb();
        const result = await db.collection('trips').deleteOne({ id: req.params.id });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        
        // Remove schedules that belonged to this trip
        await db.collection('schedules').deleteMany({ tripId: req.params.id });
        
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete trip' });
    }
});

export default router;