import TicketClass from "./schemas/ticket-classes.js";

export async function getTicketClassById(classId) {
  return TicketClass.findOne({ class: classId }).lean();
}

export async function getAllTicketClasses() {
  return TicketClass.find({}).lean();
}

export async function getTicketClassesForDay(day) {
  return TicketClass.find({ 
    daysAvailable: { $regex: new RegExp(`^${day}$`, 'i') } 
  }).lean(); 
}