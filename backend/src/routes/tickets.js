import express from 'express';
import * as ticketService from '../services/ticketService.js';

const router = express.Router();

// GET /api/tickets - List all tickets with filtering and sorting
router.get('/', async (req, res) => {
  try {
    const { status, sortBy } = req.query;
    const tickets = await ticketService.getAllTickets({ status, sortBy });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tickets/:id - Get single ticket
router.get('/:id', async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    res.json(ticket);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// POST /api/tickets - Create new ticket
router.post('/', async (req, res) => {
  try {
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/tickets/:id - Update ticket
router.patch('/:id', async (req, res) => {
  try {
    const ticket = await ticketService.updateTicket(req.params.id, req.body);
    res.json(ticket);
  } catch (err) {
    const statusCode = err.message === 'Ticket not found' ? 404 : 400;
    res.status(statusCode).json({ error: err.message });
  }
});

export default router;
