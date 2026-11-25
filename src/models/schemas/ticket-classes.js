import mongoose from "mongoose";

const ticketClassSchema = new mongoose.Schema(
  {
    class: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerKm: {
      type: Number,
      required: true,
      min: 0, 
    },
    amenities: {
      type: [String],
      required: false,
    },
    daysAvailable: {
      type: [{
        type: String,
        lowercase: true,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      }],
      required: false,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "ticketClasses", 
  }
);

const TicketClass = mongoose.model("TicketClass", ticketClassSchema);

export default TicketClass;