import TicketClass from "./schemas/ticket-classes.js";

export async function getTicketClassById(classId) {
  return TicketClass.findOne({ class: classId }).lean();
}

export async function getAllTicketClasses() {
  return TicketClass.find({}).lean();
}

export async function getTicketClassesForDay(day) {
  // day is already checked against an allowlist in the controller.
  // A class with no daysAvailable list runs every day.
  return TicketClass.find({
    $or: [
      { daysAvailable: day },
      { daysAvailable: { $exists: false } },
      { daysAvailable: { $size: 0 } },
    ],
  }).lean();
}