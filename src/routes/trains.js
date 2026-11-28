import { getDb } from '../db/connect.js';

const trainsPage = (req, res) => {
    res.render('trains', { title: 'Trains' });
};

const trainsApi = async (req, res, next) => {
    try {
        const page = req.query.page === undefined ? 1 : Number(req.query.page);
        const pageSize = 10;

        // Validate the page number
        if (!Number.isInteger(page) || page < 1) {
            return res.status(400).json({
                error: 'Page must be a positive integer.'
            });
        }

        const collection = getDb().collection('trains');

        // Count all available trains
        const totalTrains = await collection.countDocuments();

        // Calculate how many records to skip
        const skip = (page - 1) * pageSize;

        // Retrieve only the trains for this page
        const trains = await collection
            .find({})
            .sort({ name: 1 })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        return res.json({
            trains,
            pagination: {
                currentPage: page,
                pageSize,
                totalTrains,
                totalPages: Math.ceil(totalTrains / pageSize)
            }
        });
    } catch (error) {
        return next(error);
    }
};

export { trainsApi, trainsPage };