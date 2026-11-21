import { getAllTicketClasses, getTicketClassesForDay } from '../models/ticket-classes.js';

export const ticketClassesApi = async (req, res, next) => {
    try {
        if (req.query.day) {
            // FIX 1: Validate the day against an allowlist to prevent regex injection
            const allowedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const day = req.query.day.toLowerCase();
            
            if (!allowedDays.includes(day)) {
                return res.status(400).json({ error: 'Invalid day provided. Must be a valid day of the week.' });
            }

            const ticketClasses = await getTicketClassesForDay(day);
            return res.json({ ticketClasses });
        }
        
        const ticketClasses = await getAllTicketClasses(); 
        return res.json({ ticketClasses });
        
    } catch (error) {
        // FIX 2: Return a safe JSON error instead of passing to next()
        console.error("Error fetching ticket classes:", error);
        return res.status(500).json({ error: 'Unable to load ticket classes' });
    }
};