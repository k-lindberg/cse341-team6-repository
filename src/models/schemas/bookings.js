import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        scheduleId: {
            type: Number,
            required: true,
        },
        tripId: {
            type: String,
            required: true,
        },
        ticketClass: {
            type: String,
            required: true,
            trim: true
        },
        selectedDay: {
            type: String,
            required: true,
            trim: true
        },
        passengers: {
            type: [
                {
                    firstName: {
                        type: String,
                        required: true,
                        trim: true
                    },
                    lastName: {
                        type: String,
                        required: true,
                        trim: true
                    },
                    email: {
                        type: String,
                        required: true,
                        trim: true
                    },
                    phone: {
                        type: String,
                        required: true,
                        trim: true
                    },
                },
            ],
            validate: {
                validator: (list) => list.length > 0,
                message: 'Passengers list cannot be empty'
            }
        }
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;