import { getAllTicketClasses, getTicketClassesForDay } from '../models/ticket-classes.js';

const ticketClassesPage = (req, res) => {
    res.render('ticket-classes', { title: 'Ticket Classes' });
};

const ticketClassesApi = async (req, res, next) => {
    try {
        // Check if a 'day' query parameter was passed in the URL
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

export { ticketClassesApi, ticketClassesPage };