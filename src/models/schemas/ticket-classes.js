import mongoose from "mongoose";

const ticketClassSchema = new mongoose.Schema(
  {
    id: {
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
    description: {
      type: String,
      required: true,
      trim: true,
    },
    priceMultiplier: {
      type: Number,
      required: true,
      min: 1,
    },
    amenities: {
      type: String,
      required: false,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const TicketClass = mongoose.model("TicketClass", ticketClassSchema);

export default TicketClass;