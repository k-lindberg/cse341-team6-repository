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
      min: 0, // <-- ADDED THIS LINE
    },
    amenities: {
      type: [String],
      required: false,
    },
    daysAvailable: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "ticketClasses", // <-- THIS IS THE MAGIC LINE
  }
);

const TicketClass = mongoose.model("TicketClass", ticketClassSchema);

export default TicketClass;