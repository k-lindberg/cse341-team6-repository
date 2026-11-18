import railTripsRouter from './trips.js';
import { trainsApi, trainsPage } from './trains.js';
import { ticketClassesApi, ticketClassesPage } from './ticket-classes.js'; // <-- NEW IMPORT
import { Router } from 'express';
import { homePage, aboutPage, testErrorPage } from './index.js';

const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page
router.get('/trains', trainsPage);
router.get('/api/trains', trainsApi);

// Ticket Classes page <-- NEW ROUTES
router.get('/ticket-classes', ticketClassesPage);
router.get('/api/ticket-classes', ticketClassesApi);

// Rail trips
router.use('/trips', railTripsRouter);

// Test 500 error page
router.get('/500', testErrorPage);

export default router;