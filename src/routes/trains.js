import { getDb } from '../db/connect.js';

const trainsPage = (req, res) => {
    res.render('trains', { title: 'Trains' });
};

// Escape special characters so search input is treated as plain text.
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const trainsApi = async (req, res, next) => {
    try {
        const page = req.query.page === undefined ? 1 : Number(req.query.page);
        const pageSize = 10;

        // Validate the page number.
        if (!Number.isInteger(page) || page < 1) {
            return res.status(400).json({
                error: 'Page must be a positive integer.'
            });
        }

        // Validate search input if it was supplied.
        if (
            req.query.search !== undefined &&
            (
                typeof req.query.search !== 'string' ||
                req.query.search.trim().length > 100
            )
        ) {
            return res.status(400).json({
                error: 'Search must be a string of no more than 100 characters.'
            });
        }

        // Validate the train type if it was supplied.
        if (
            req.query.type !== undefined &&
            (
                typeof req.query.type !== 'string' ||
                req.query.type.trim().length > 50
            )
        ) {
            return res.status(400).json({
                error: 'Train type must be a string of no more than 50 characters.'
            });
        }

        // Missing search/type values are allowed.
        const search = typeof req.query.search === 'string'
            ? req.query.search.trim()
            : '';

        const type = typeof req.query.type === 'string'
            ? req.query.type.trim()
            : '';

        const collection = getDb().collection('trains');

        // Build the MongoDB query using the supplied filters.
        const filters = {};

        if (search) {
            const searchPattern = new RegExp(escapeRegex(search), 'i');

            filters.$or = [
                { name: searchPattern },
                { operator: searchPattern },
                { type: searchPattern },
                { powerSource: searchPattern },
                { description: searchPattern }
            ];
        }

        if (type) {
            filters.type = {
                $regex: `^${escapeRegex(type)}$`,
                $options: 'i'
            };
        }

        // Count only trains matching the filters.
        const totalTrains = await collection.countDocuments(filters);

        // Calculate how many matching records to skip.
        const skip = (page - 1) * pageSize;

        // Retrieve the matching trains for this page.
        const trains = await collection
            .find(filters)
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