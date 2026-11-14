import { getDb } from '../db/connect.js';
import { generateConfirmationCode } from '../includes/helpers.js';
import {
    createBooking as createNewBooking,
    getAllBookings as findAllBookings,
} from '../models/bookings.js';

export async function getAllBookings(req, res) {
    try {
        const bookings = await findAllBookings();
        return res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
}

export async function processBookingRequest(req, res) {
    try {
        const bookingData = {
            id: generateConfirmationCode(),
            ...req.body
        };
        const booking =await createNewBooking(bookingData);

        return res.redirect(`/trips/confirmation/${booking.id}`);
    } catch (error) {
        console.error('Error processing booking request:', error);
        return res.status(500).json({ error: 'Failed to process booking request' });
    }
}

export async function bookingPage(req, res) {
    const { scheduleId } = req.params;

    const db = getDb();
    
    // Future refactor after Trips/Schedules model functions exist
    // const schedule = await getScheduleById(scheduleId);

    const schedule = await db.collection('schedules')
        .findOne({ id: Number(scheduleId) });
    
    // Future refactor after Trips/Schedules model functions exist
    // const trip = await getTripById(schedule.tripId);
    
    const trip = await db.collection('trips')
        .findOne({ id: schedule.tripId });
    const ticketClasses = await db.collection('ticketClasses').find({}).toArray();
    const ticketOptions = ticketClasses.map((ticketClass) => ({
        class: ticketClass.class,
        name: ticketClass.name,
        price: trip.distance * ticketClass.pricePerKm,
        amenities: ticketClass.amenities,
        description: ticketClass.description
    }));

    res.render('trips/book', {
        title: 'Book Trip',
        schedule,
        ticketOptions
    });
}

export function bookingsAdminPage(req, res) {
    res.render('bookings', {
        title: 'Bookings Admin',
    });
}