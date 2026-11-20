import { getAllTicketClasses, getTicketClassesForDay } from '../models/ticket-classes.js';

export const ticketClassesApi = async (req, res, next) => {
    try {
        if (req.query.day) {
            const ticketClasses = await getTicketClassesForDay(req.query.day);
            return res.json({ ticketClasses });
        }
        const ticketClasses = await getAllTicketClasses(); 
        return res.json({ ticketClasses });
    } catch (error) {
        return next(error);
    }
};