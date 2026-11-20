import Booking from './schemas/bookings.js';

export async function createBooking(bookingData) {
    const newBooking = new Booking(bookingData);
    return newBooking.save();
}

export async function getAllBookings() {
    return Booking.find({}).lean();
}

export async function getBookingById(id) {
    return Booking.findOne({ id }).lean();
}
