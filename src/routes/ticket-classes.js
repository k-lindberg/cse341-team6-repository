import { getAllTicketClasses } from '../models/ticket-classes.js';

const ticketClassesPage = (req, res) => {
    res.render('ticket-classes', { title: 'Ticket Classes' });
};

const ticketClassesApi = async (req, res, next) => {
    try {
        const ticketClasses = await getAllTicketClasses(); 
        return res.json({ ticketClasses });
    } catch (error) {
        return next(error);
    }
};

export { ticketClassesApi, ticketClassesPage };