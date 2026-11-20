import { ticketClassesApi } from '../controllers/ticket-classes.js';

export const ticketClassesPage = (req, res) => {
    res.render('ticket-classes', { title: 'Ticket Classes' });
};

export { ticketClassesApi };