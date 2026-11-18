import TicketClass from "./schemas/ticket-classes.js";

export async function getTicketClassById(id) {
  return TicketClass.findOne({ id }).lean();
}

export async function getAllTicketClasses() {
  return TicketClass.find({}).lean();
}