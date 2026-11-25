import { Router } from 'express';
import { getDb } from '../db/connect.js';

const router = Router();

// GET all trips
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const trips = await db.collection('trips').find({}).toArray();
        res.json({ trips });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
});

// DELETE a trip
router.delete('/:id', async (req, res) => {
    try {
        const db = getDb();
        const result = await db.collection('trips').deleteOne({ id: req.params.id });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete trip' });
    }
});

export default router;